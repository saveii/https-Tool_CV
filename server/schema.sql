-- MySQL Database Schema for Tool_CV / CVForge
-- Execute this script in MySQL Workbench, phpMyAdmin, or MySQL CLI

CREATE DATABASE IF NOT EXISTS `cvforge_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `cvforge_db`;

-- 1. Users Table (Core Identity)
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `phone` VARCHAR(50) UNIQUE DEFAULT NULL, -- Enforces 1 Account per Phone Number
  `password` VARCHAR(255) DEFAULT NULL,
  `provider` ENUM('local', 'google', 'facebook') DEFAULT 'local',
  `provider_id` VARCHAR(255) DEFAULT NULL,
  `avatar` TEXT DEFAULT NULL,
  `role` ENUM('user', 'admin') DEFAULT 'user',
  `headline` VARCHAR(255) DEFAULT 'Professional',
  `bio` TEXT DEFAULT NULL,
  `location` VARCHAR(255) DEFAULT 'Phnom Penh, Cambodia',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_phone` (`phone`),
  INDEX `idx_provider` (`provider`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Social Accounts Table (Stores Linked Meta/Facebook & Google OAuth Accounts)
CREATE TABLE IF NOT EXISTS `social_accounts` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `provider` ENUM('facebook', 'google') NOT NULL,
  `provider_user_id` VARCHAR(255) NOT NULL,
  `access_token` TEXT DEFAULT NULL,
  `profile_data` LONGTEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_user_provider` (`user_id`, `provider`),
  INDEX `idx_provider_uid` (`provider`, `provider_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. CVs Table (Stores Cloud-Saved CVs & Variations)
CREATE TABLE IF NOT EXISTS `cvs` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `template` VARCHAR(50) DEFAULT 'modern',
  `theme_color` VARCHAR(50) DEFAULT '#2563eb',
  `font_family` VARCHAR(50) DEFAULT 'Inter',
  `font_size` VARCHAR(20) DEFAULT 'medium',
  `cv_data` LONGTEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Default Admin Account (Password: admin123)
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `provider`, `role`, `headline`)
VALUES (
  'usr_admin_master',
  'CVForge Admin Master',
  'admin@cvforge.com',
  '+855 12 999 888',
  '$2a$10$iI8Y0NqB8aJ7n1yG0S0TteHh7q5V8u6RjW3K7n2X9Z8m5L6Q4P3E2',
  'local',
  'admin',
  'System Administrator'
) ON DUPLICATE KEY UPDATE `role`='admin';
