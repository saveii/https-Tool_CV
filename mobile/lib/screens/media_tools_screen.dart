import 'package:flutter/material.dart';
import '../services/api_service.dart';

class MediaToolsScreen extends StatefulWidget {
  const MediaToolsScreen({super.key});

  @override
  State<MediaToolsScreen> createState() => _MediaToolsScreenState();
}

class _MediaToolsScreenState extends State<MediaToolsScreen> {
  final _videoUrlController = TextEditingController();
  bool _isLoading = false;
  Map<String, dynamic>? _videoData;

  void _downloadVideo() async {
    if (_videoUrlController.text.trim().isEmpty) return;
    setState(() => _isLoading = true);
    final result = await ApiService.downloadVideo(_videoUrlController.text.trim());
    setState(() {
      _isLoading = false;
      if (result['success'] == true) {
        _videoData = result['data'];
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF090D16),
        title: const Text('Video & Translation Tools', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Video Download Input
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF0F172A),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF1E293B)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '📥 ទាញយកវីដេអូ (Paste Video URL)',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: _videoUrlController,
                    style: const TextStyle(fontSize: 12, color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'https://tiktok.com/... or https://facebook.com/...',
                      hintStyle: const TextStyle(color: Color(0xFF64748B), fontSize: 11),
                      filled: true,
                      fillColor: const Color(0xFF090D16),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: const BorderSide(color: Color(0xFF1E293B)),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: _isLoading ? null : _downloadVideo,
                      icon: const Icon(Icons.download_rounded, size: 16),
                      label: _isLoading
                          ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                          : const Text('Download & Process Video'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2563EB),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            if (_videoData != null) ...[
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF10B981).withOpacity(0.4)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.check_circle, color: Color(0xFF10B981), size: 18),
                        SizedBox(width: 8),
                        Text('Ready for Auto Subtitle & Cutter', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text('Resolution: ${_videoData!['resolution']}', style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {},
                            icon: const Icon(Icons.cut_rounded, size: 14),
                            label: const Text('Cut Video', style: TextStyle(fontSize: 11)),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () {},
                            icon: const Icon(Icons.subtitles_rounded, size: 14),
                            label: const Text('Auto Subtitle', style: TextStyle(fontSize: 11)),
                            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6366F1), foregroundColor: Colors.white),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
