import 'package:flutter/material.dart';
import '../services/api_service.dart';

class CvEditorScreen extends StatefulWidget {
  const CvEditorScreen({super.key});

  @override
  State<CvEditorScreen> createState() => _CvEditorScreenState();
}

class _CvEditorScreenState extends State<CvEditorScreen> {
  final _nameController = TextEditingController(text: 'Vireak Roth');
  final _titleController = TextEditingController(text: 'Senior Full Stack & AI Engineer');
  final _phoneController = TextEditingController(text: '+855 12 345 678');
  final _emailController = TextEditingController(text: 'vireak.roth@example.com');
  final _linkController = TextEditingController();

  bool _isScanning = false;

  void _scanLink() async {
    if (_linkController.text.trim().isEmpty) return;
    setState(() => _isScanning = true);
    final result = await ApiService.scanCvImageUrl(_linkController.text.trim());
    setState(() => _isScanning = false);
    if (!mounted) return;

    if (result['success'] == true && result['data'] != null) {
      final info = result['data']['personalInfo'] ?? {};
      setState(() {
        if (info['fullName'] != null) _nameController.text = info['fullName'];
        if (info['jobTitle'] != null) _titleController.text = info['jobTitle'];
        if (info['phone'] != null) _phoneController.text = info['phone'];
        if (info['email'] != null) _emailController.text = info['email'];
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('✨ បានទាញយកទិន្នន័យពី Link ជោគជ័យ!')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF090D16),
        title: const Text('CV Editor & Form', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.picture_as_pdf_rounded, color: Colors.blueAccent),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('📄 Generating PDF on Server...')),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // AI Scan Link Card
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFF0F172A),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF3B82F6).withValues(alpha: 0.4)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.auto_awesome, color: Colors.blueAccent, size: 18),
                      SizedBox(width: 8),
                      Text(
                        'AI Smart Scan (Pinterest / Image Link)',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _linkController,
                          style: const TextStyle(fontSize: 12, color: Colors.white),
                          decoration: InputDecoration(
                            hintText: 'Paste image link or pin.it...',
                            hintStyle: const TextStyle(color: Color(0xFF64748B), fontSize: 11),
                            filled: true,
                            fillColor: const Color(0xFF090D16),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                              borderSide: const BorderSide(color: Color(0xFF1E293B)),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton(
                        onPressed: _isScanning ? null : _scanLink,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF2563EB),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                        ),
                        child: _isScanning
                            ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                            : const Text('Scan', style: TextStyle(fontSize: 12, color: Colors.white)),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Form Fields
            const Text('ព័ត៌មានផ្ទាល់ខ្លួន (Personal Info)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 12),
            _buildInputField('ឈ្មោះពេញ (Full Name)', _nameController, Icons.person_outline),
            const SizedBox(height: 12),
            _buildInputField('តួនាទី / ជំនាញ (Job Title)', _titleController, Icons.work_outline),
            const SizedBox(height: 12),
            _buildInputField('លេខទូរស័ព្ទ (Phone Number)', _phoneController, Icons.phone_outlined),
            const SizedBox(height: 12),
            _buildInputField('អ៊ីមែល (Email Address)', _emailController, Icons.email_outlined),
          ],
        ),
      ),
    );
  }

  Widget _buildInputField(String label, TextEditingController controller, IconData icon) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
        const SizedBox(height: 6),
        TextField(
          controller: controller,
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
