import 'package:flutter/material.dart';
import '../services/api_service.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool _isLogin = true;
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;

  void _submit() async {
    setState(() => _isLoading = true);
    Map<String, dynamic> result;
    if (_isLogin) {
      result = await ApiService.login(_phoneController.text.trim().isNotEmpty ? _phoneController.text.trim() : _emailController.text.trim(), _passwordController.text);
    } else {
      result = await ApiService.register(
        _nameController.text.trim(),
        _emailController.text.trim(),
        _phoneController.text.trim(),
        _passwordController.text,
      );
    }
    setState(() => _isLoading = false);

    if (result['success'] == true || result['token'] != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(_isLogin ? '🎉 ចូលប្រើប្រាស់ជោគជ័យ!' : '🎉 បានចុះឈ្មោះជោគជ័យ!')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['message'] ?? 'មានបញ្ហា សូមព្យាយាមម្តងទៀត')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF090D16),
        title: Text(_isLogin ? 'ចូលគណនី (Sign In)' : 'បង្កើតគណនីថ្មី (Register)', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Center(
              child: Column(
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(colors: [Color(0xFF2563EB), Color(0xFF6366F1)]),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Icon(Icons.lock_outline_rounded, color: Colors.white, size: 28),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    _isLogin ? 'សូមស្វាគមន៍មកកាន់ Tool System' : 'ចុះឈ្មោះបង្កើតគណនី',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    '1 លេខទូរស័ព្ទ = 1 គណនី (Unique Phone Account)',
                    style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            if (!_isLogin) ...[
              _buildField('ឈ្មោះពេញ (Full Name)', _nameController, Icons.person_outline),
              const SizedBox(height: 12),
              _buildField('អ៊ីមែល (Email)', _emailController, Icons.email_outlined),
              const SizedBox(height: 12),
            ],

            _buildField('លេខទូរស័ព្ទ (Phone Number)', _phoneController, Icons.phone_outlined),
            const SizedBox(height: 12),
            _buildField('ពាក្យសម្ងាត់ (Password)', _passwordController, Icons.lock_outline, isPassword: true),
            const SizedBox(height: 20),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2563EB),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: _isLoading
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : Text(_isLogin ? 'ចូលគណនី' : 'បង្កើតគណនី', style: const TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 16),

            // Toggle Login / Register
            Center(
              child: TextButton(
                onPressed: () => setState(() => _isLogin = !_isLogin),
                child: Text(
                  _isLogin ? 'មិនទាន់មានគណនី? ចុះឈ្មោះទីនេះ' : 'មានគណនីរួចហើយ? ចូលទីនេះ',
                  style: const TextStyle(color: Color(0xFF38BDF8), fontSize: 12),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildField(String label, TextEditingController controller, IconData icon, {bool isPassword = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
        const SizedBox(height: 6),
        TextField(
          controller: controller,
          obscureText: isPassword,
          style: const TextStyle(fontSize: 13, color: Colors.white),
          decoration: InputDecoration(
            prefixIcon: Icon(icon, color: const Color(0xFF64748B), size: 18),
            filled: true,
            fillColor: const Color(0xFF0F172A),
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFF1E293B)),
            ),
          ),
        ),
      ],
    );
  }
}
