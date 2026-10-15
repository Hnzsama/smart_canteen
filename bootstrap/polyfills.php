<?php

/**
 * Polyfill for PHP fileinfo extension when missing (e.g. minimal aaPanel/VPS environments).
 * Prevents "Class 'finfo' not found" fatal errors in League Flysystem and Laravel Storage.
 */

if (! defined('FILEINFO_NONE')) {
    define('FILEINFO_NONE', 0);
}
if (! defined('FILEINFO_SYMLINK')) {
    define('FILEINFO_SYMLINK', 2);
}
if (! defined('FILEINFO_MIME')) {
    define('FILEINFO_MIME', 1040);
}
if (! defined('FILEINFO_MIME_TYPE')) {
    define('FILEINFO_MIME_TYPE', 16);
}
if (! defined('FILEINFO_MIME_ENCODING')) {
    define('FILEINFO_MIME_ENCODING', 1024);
}
if (! defined('FILEINFO_DEVICES')) {
    define('FILEINFO_DEVICES', 8);
}
if (! defined('FILEINFO_CONTINUE')) {
    define('FILEINFO_CONTINUE', 32);
}
if (! defined('FILEINFO_PRESERVE_ATIME')) {
    define('FILEINFO_PRESERVE_ATIME', 128);
}
if (! defined('FILEINFO_RAW')) {
    define('FILEINFO_RAW', 256);
}
if (! defined('FILEINFO_EXTENSION')) {
    define('FILEINFO_EXTENSION', 2097152);
}

if (! class_exists('finfo', false)) {
    class finfo
    {
        public function __construct(int $flags = FILEINFO_NONE, ?string $magicFile = null)
        {
        }

        public function buffer(string $string, int $flags = FILEINFO_NONE, $context = null): string|false
        {
            return false;
        }

        public function file(string $filename, int $flags = FILEINFO_NONE, $context = null): string|false
        {
            return false;
        }

        public function set_flags(int $flags): bool
        {
            return true;
        }
    }
}

if (! function_exists('finfo_open')) {
    function finfo_open(int $flags = FILEINFO_NONE, ?string $magicFile = null)
    {
        return new finfo($flags, $magicFile);
    }
}

if (! function_exists('finfo_file')) {
    function finfo_file($finfo, string $filename, int $flags = FILEINFO_NONE, $context = null)
    {
        return false;
    }
}

if (! function_exists('finfo_buffer')) {
    function finfo_buffer($finfo, string $string, int $flags = FILEINFO_NONE, $context = null)
    {
        return false;
    }
}

if (! function_exists('finfo_close')) {
    function finfo_close($finfo): bool
    {
        return true;
    }
}

if (! function_exists('mime_content_type')) {
    function mime_content_type(string $filename): string|false
    {
        return false;
    }
}
