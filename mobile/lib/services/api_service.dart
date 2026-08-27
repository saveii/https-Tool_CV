import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  // Base API URL (can be localhost for Android Emulator: 10.0.2.2 or physical device IP)
  static const String baseUrl = 'http://10.0.2.2:5000/api';

  // 1. Authentication Header
  static Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  // 2. User Login
  static Future<Map<String, dynamic>> login(String emailOrPhone, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'emailOrPhone': emailOrPhone,
          'password': password,
        }),
      );
      final data = jsonDecode(response.body);
      if (data['token'] != null) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', data['token']);
        await prefs.setString('user', jsonEncode(data['user']));
      }
      return data;
    } catch (e) {
      return {'success': false, 'message': 'Network connection failed: $e'};
    }
  }

  // 3. User Registration (1 Account per Phone Number)
  static Future<Map<String, dynamic>> register(String name, String email, String phone, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name,
          'email': email,
          'phone': phone,
          'password': password,
        }),
      );
      return jsonDecode(response.body);
    } catch (e) {
      return {'success': false, 'message': 'Registration error: $e'};
    }
  }

  // 4. AI CV Scanner from Image Link / Pinterest
  static Future<Map<String, dynamic>> scanCvImageUrl(String imageUrl) async {
    try {
      final headers = await _getHeaders();
      final response = await http.post(
        Uri.parse('$baseUrl/ai/parse-resume-url'),
        headers: headers,
        body: jsonEncode({'imageUrl': imageUrl}),
      );
      return jsonDecode(response.body);
    } catch (e) {
      return {'success': false, 'message': 'AI scanner error: $e'};
    }
  }

  // 5. Upload & Scan CV File / Photo from Gallery
  static Future<Map<String, dynamic>> uploadAndScanCv(File file) async {
    try {
      final request = http.MultipartRequest('POST', Uri.parse('$baseUrl/ai/parse-resume-file'));
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }
      request.files.add(await http.MultipartFile.fromPath('file', file.path));

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);
      return jsonDecode(response.body);
    } catch (e) {
      return {'success': false, 'message': 'Upload failed: $e'};
    }
  }

  // 6. Export CV to PDF (High-Quality Server Render)
  static Future<List<int>?> exportPdf(Map<String, dynamic> cvData, Map<String, dynamic> settings) async {
    try {
      final headers = await _getHeaders();
      final response = await http.post(
        Uri.parse('$baseUrl/export-pdf'),
        headers: headers,
        body: jsonEncode({
          'data': cvData,
          'template': settings['template'] ?? 'modern',
          'themeColor': settings['themeColor'] ?? '#2563eb',
          'fontFamily': settings['fontFamily'] ?? 'Inter',
        }),
      );
      if (response.statusCode == 200) {
        return response.bodyBytes;
      }
      return null;
    } catch (e) {
      print('PDF Export Error: $e');
      return null;
    }
  }

  // 7. Video Download & Subtitle Tools
  static Future<Map<String, dynamic>> downloadVideo(String videoUrl) async {
    try {
      final headers = await _getHeaders();
      final response = await http.post(
        Uri.parse('$baseUrl/media/download-video'),
        headers: headers,
        body: jsonEncode({'videoUrl': videoUrl}),
      );
      return jsonDecode(response.body);
    } catch (e) {
      return {'success': false, 'message': 'Video tool error: $e'};
    }
  }

  static Future<Map<String, dynamic>> generateSubtitles(String videoUrl, String language) async {
    try {
      final headers = await _getHeaders();
      final response = await http.post(
        Uri.parse('$baseUrl/media/auto-subtitle'),
        headers: headers,
        body: jsonEncode({'videoUrl': videoUrl, 'language': language}),
      );
      return jsonDecode(response.body);
    } catch (e) {
      return {'success': false, 'message': 'Subtitle generation error: $e'};
    }
  }
}
