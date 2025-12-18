// src/components/admin/AdminAuth.jsx
import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import Swal from 'sweetalert2';

const AdminAuth = ({ mode = 'login' }) => {
    const { isDarkMode } = useContext(ThemeContext);
    const [isLogin, setIsLogin] = useState(mode === 'login');
    const [fieldErrors, setFieldErrors] = useState({});
    const [currentTime, setCurrentTime] = useState(new Date());
    const [passwordStrength, setPasswordStrength] = useState({
        isValid: false,
        errors: [],
        strength: 'weak'
    });
    const [formData, setFormData] = useState({
        // Basic Information
        username: '',
        email: '',
        password: '',
        confirmPassword: '',

        // Personal Information
        firstName: '',
        lastName: '',

        // Contact Information
        phone: '',
        emergencyContact: {
            name: '',
            phone: '',
            relationship: ''
        },

        // Role and Permissions
        role: 'admin',
        permissions: [],

        // Department & Work
        department: 'management',
        employeeId: '',
        joinDate: new Date().toISOString().split('T')[0],

        // Preferences
        preferences: {
            language: 'en',
            theme: 'auto',
            notifications: {
                email: true,
                push: true,
                sound: true
            },
            defaultView: 'overview'
        },

        // Two Factor Auth
        twoFactorAuth: {
            enabled: false,
            method: 'authenticator'
        },

        // Security Settings
        securitySettings: {
            requireTwoFactor: false,
            sessionTimeout: 30,
            maxFailedAttempts: 5,
            forcePasswordChange: false,
            passwordExpiryDays: 90
        }
    });

    const [loading, setLoading] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const getWatchHandRotations = () => {
        const hours = currentTime.getHours() % 12;
        const minutes = currentTime.getMinutes();
        const seconds = currentTime.getSeconds();

        return {
            hourRotation: (hours * 30) + (minutes * 0.5), // 360/12 = 30 degrees per hour
            minuteRotation: (minutes * 6), // 360/60 = 6 degrees per minute
            secondRotation: (seconds * 6) // 360/60 = 6 degrees per second
        };
    };

    const rotations = getWatchHandRotations();

    const validatePassword = async (password) => {
        if (password.length === 0) return;

        try {
            const response = await fetch('/api/admin/validate-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();
            if (data.success) {
                setPasswordStrength(data);
            }
        } catch (error) {
            console.error('Password validation error:', error);
        }
    };


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        if (name === 'password' && !isLogin) {
            validatePassword(value);
        }


        if (name.includes('.')) {
            const keys = name.split('.');
            setFormData(prev => {
                const newData = { ...prev };
                let current = newData;
                for (let i = 0; i < keys.length - 1; i++) {
                    if (!current[keys[i]]) current[keys[i]] = {};
                    current = current[keys[i]];
                }
                current[keys[keys.length - 1]] = type === 'checkbox' ? checked : value;
                return newData;
            });
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handlePermissionChange = (module, action, checked) => {
        setFormData(prev => {
            const permissions = [...prev.permissions];
            const moduleIndex = permissions.findIndex(p => p.module === module);

            if (checked) {
                if (moduleIndex === -1) {
                    permissions.push({ module, actions: [action] });
                } else if (!permissions[moduleIndex].actions.includes(action)) {
                    permissions[moduleIndex].actions.push(action);
                }
            } else {
                if (moduleIndex !== -1) {
                    permissions[moduleIndex].actions = permissions[moduleIndex].actions.filter(a => a !== action);
                    if (permissions[moduleIndex].actions.length === 0) {
                        permissions.splice(moduleIndex, 1);
                    }
                }
            }

            return { ...prev, permissions };
        });
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        if (isLogin) {
            if (!formData.email?.trim()) {
                errors.email = 'Email address is required';
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                errors.email = 'Please enter a valid email address (e.g., admin@soleitic.com)';
                isValid = false;
            }

            if (!formData.password) {
                errors.password = 'Password is required';
                isValid = false;
            }
        } else {
            // Registration validation
            if (!formData.firstName?.trim()) {
                errors.firstName = 'First name is required';
                isValid = false;
            } else if (formData.firstName.length > 50) {
                errors.firstName = 'First name cannot exceed 50 characters';
                isValid = false;
            }

            if (!formData.lastName?.trim()) {
                errors.lastName = 'Last name is required';
                isValid = false;
            } else if (formData.lastName.length > 50) {
                errors.lastName = 'Last name cannot exceed 50 characters';
                isValid = false;
            }

            if (!formData.username?.trim()) {
                errors.username = 'Username is required';
                isValid = false;
            } else if (formData.username.length < 3) {
                errors.username = 'Username must be at least 3 characters';
                isValid = false;
            } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
                errors.username = 'Username can only contain letters, numbers, and underscores (no spaces)';
                isValid = false;
            }

            if (!formData.email?.trim()) {
                errors.email = 'Email address is required';
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                errors.email = 'Please enter a valid email address';
                isValid = false;
            }

            if (!formData.password) {
                errors.password = 'Password is required';
                isValid = false;
            } else if (formData.password.length < 12) {
                errors.password = 'Password must be at least 12 characters';
                isValid = false;
            } else if (!/(?=.*[a-z])/.test(formData.password)) {
                errors.password = 'Password must contain at least one lowercase letter';
                isValid = false;
            } else if (!/(?=.*[A-Z])/.test(formData.password)) {
                errors.password = 'Password must contain at least one uppercase letter';
                isValid = false;
            } else if (!/(?=.*\d)/.test(formData.password)) {
                errors.password = 'Password must contain at least one number';
                isValid = false;
            } else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
                errors.password = 'Password must contain at least one special character (@$!%*?&)';
                isValid = false;
            }

            if (!formData.confirmPassword) {
                errors.confirmPassword = 'Please confirm your password';
                isValid = false;
            } else if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = 'Passwords do not match';
                isValid = false;
            }

            if (!formData.department) {
                errors.department = 'Please select a department';
                isValid = false;
            }

            if (!formData.role) {
                errors.role = 'Please select a role';
                isValid = false;
            }
        }

        setFieldErrors(errors);
        return isValid;
    };


    // Updated handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // Show error summary
            const errorFields = Object.keys(fieldErrors);
            if (errorFields.length > 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Please fix the following errors:',
                    html: `
                    <div class="SoleiTic-Admin-validation-errors">
                        <ul style="text-align: left; margin: 0; padding-left: 20px;">
                            ${errorFields.map(field =>
                        `<li><strong>${field}:</strong> ${fieldErrors[field]}</li>`
                    ).join('')}
                        </ul>
                    </div>
                `,
                    confirmButtonText: 'OK'
                });
            }
            return;
        }

        setLoading(true);

        try {
            const endpoint = isLogin ? '/api/admin/login' : '/api/admin/register';
            const payload = isLogin ? {
                email: formData.email,
                password: formData.password,
                rememberMe: true
            } : formData;

            console.log('Sending payload:', payload); // Debug

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            // DEBUG: Get raw response text first

            const rawResponse = await response.text();
            console.log('Raw response:', rawResponse.substring(0, 200)); // First 200 chars
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            let data;
            try {
                data = JSON.parse(rawResponse);
                console.log('Parsed JSON data:', data);
            } catch (parseError) {
                console.error('Failed to parse JSON:', parseError);
                console.log('Raw response full:', rawResponse);

                // Check if it's HTML error page
                if (rawResponse.includes('<!DOCTYPE') || rawResponse.includes('<html>')) {
                    throw new Error('Server returned HTML error page. Check server logs.');
                } else if (rawResponse.includes('Cloudinary')) {
                    throw new Error('Cloudinary upload error: ' + rawResponse);
                } else {
                    throw new Error(`Server returned non-JSON response: ${rawResponse.substring(0, 100)}...`);
                }
            }

            if (!response.ok) {
                // Check for validation errors
                if (data.errorType === 'validation' || data.errors) {
                    // Handle validation errors
                    const errorMessages = [];
                    const backendFieldErrors = {};

                    // Extract errors from different possible structures
                    if (Array.isArray(data.errors)) {
                        data.errors.forEach(err => {
                            // Check different possible error structures
                            const field = err.field || err.path || 'form';
                            const message = err.message || err.msg || err.mainMessage || 'Validation error';

                            errorMessages.push(`<li><strong>${field}:</strong> ${message}</li>`);
                            backendFieldErrors[field] = message;
                        });
                    } else if (typeof data.errors === 'object') {
                        // Handle object format errors
                        Object.entries(data.errors).forEach(([field, messages]) => {
                            if (Array.isArray(messages)) {
                                messages.forEach(message => {
                                    errorMessages.push(`<li><strong>${field}:</strong> ${message}</li>`);
                                    backendFieldErrors[field] = messages[0];
                                });
                            } else if (typeof messages === 'string') {
                                errorMessages.push(`<li><strong>${field}:</strong> ${messages}</li>`);
                                backendFieldErrors[field] = messages;
                            }
                        });
                    }

                    // Update field errors state
                    setFieldErrors(prev => ({ ...prev, ...backendFieldErrors }));

                    // Show detailed error alert
                    if (errorMessages.length > 0) {
                        Swal.fire({
                            icon: 'error',
                            title: data.message || 'Validation Failed',
                            html: `
                            <div class="SoleiTic-Admin-backend-validation">
                                <p><strong>Please fix the following:</strong></p>
                                <ul style="text-align: left; margin: 15px 0; padding-left: 20px;">
                                    ${errorMessages.join('')}
                                </ul>
                                ${data.errorCount ? `<p><small>Total errors: ${data.errorCount}</small></p>` : ''}
                            </div>
                        `,
                            confirmButtonText: 'Fix Errors'
                        });
                    } else {
                        // Generic validation error
                        Swal.fire({
                            icon: 'error',
                            title: data.message || 'Validation Failed',
                            text: 'Please check your input and try again.',
                            confirmButtonText: 'OK'
                        });
                    }
                } else {
                    // Other errors (duplicate, server, etc.)
                    throw new Error(data.message || `Server error: ${response.status}`);
                }
                return;
            }

            // Success handling...
            if (isLogin) {
                if (data.requiresMfa) {
                    // Handle MFA...
                } else {
                    localStorage.setItem('soleitic_admin_token', data.adminToken);
                    Swal.fire({
                        icon: 'success',
                        title: 'Login Successful',
                        text: 'Redirecting to dashboard...',
                        timer: 2000
                    }).then(() => {
                        window.location.href = '/admin/dashboard';
                    });
                }
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful!',
                    html: `
                    <div class="SoleiTic-Admin-success-message">
                        <p>Your admin account has been created successfully.</p>
                        <p>Please check your email for verification instructions.</p>
                        ${data.data?.employeeId ? `<p>Employee ID: <strong>${data.data.employeeId}</strong></p>` : ''}
                    </div>
                `,
                    confirmButtonText: 'OK'
                }).then(() => {
                    setIsLogin(true);
                });
            }

        } catch (error) {
            console.error('API Error:', error);

            // Check if it's a network error
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Network Error',
                    text: 'Unable to connect to server. Please check your internet connection.',
                    confirmButtonText: 'OK'
                });
            } else {
                // Show the actual error message
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Something went wrong. Please try again.',
                    confirmButtonText: 'OK'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const modules = [
        { id: 'users', label: 'User Management' },
        { id: 'products', label: 'Product Management' },
        { id: 'orders', label: 'Order Management' },
        { id: 'categories', label: 'Category Management' },
        { id: 'brands', label: 'Brand Management' },
        { id: 'inventory', label: 'Inventory Management' },
        { id: 'reviews', label: 'Review Management' },
        { id: 'coupons', label: 'Coupon Management' },
        { id: 'banners', label: 'Banner Management' },
        { id: 'reports', label: 'Reports & Analytics' },
        { id: 'settings', label: 'System Settings' }
    ];

    const actions = ['create', 'read', 'update', 'delete'];

    return (
        <div className={`SoleiTic-Admin-Auth-container ${isDarkMode ? 'dark' : 'light'}`}>
            <div className="SoleiTic-Admin-Auth-wrapper">
                {/* Animated Watch Background */}
                <div className="SoleiTic-Admin-watch-background">
                    <div className="SoleiTic-Admin-watch-3d">
                        <div className="SoleiTic-Admin-watch-face">
                            <div className="SoleiTic-Admin-watch-hands">
                                <div
                                    className="SoleiTic-Admin-watch-hour"
                                    style={{ transform: `rotate(${rotations.hourRotation}deg)` }}
                                ></div>
                                <div
                                    className="SoleiTic-Admin-watch-minute"
                                    style={{ transform: `rotate(${rotations.minuteRotation}deg)` }}
                                ></div>
                                <div
                                    className="SoleiTic-Admin-watch-second"
                                    style={{ transform: `rotate(${rotations.secondRotation}deg)` }}
                                ></div>
                            </div>
                            <div className="SoleiTic-Admin-watch-dial">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="SoleiTic-Admin-watch-hour-mark"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="SoleiTic-Admin-Auth-card">
                    <div className="SoleiTic-Admin-Auth-header">
                        <div className="SoleiTic-Admin-logo">
                            <span className="SoleiTic-Admin-logo-icon">⌚</span>
                            <h1 className="SoleiTic-Admin-logo-text">SoleiTic</h1>
                        </div>
                        <h2 className="SoleiTic-Admin-Auth-title">
                            {isLogin ? 'Admin Login' : 'Admin Registration'}
                        </h2>
                        <p className="SoleiTic-Admin-Auth-subtitle">
                            {isLogin
                                ? 'Access the luxury watches management dashboard'
                                : 'Create a new admin account for SoleiTic'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="SoleiTic-Admin-Auth-form">
                        {isLogin ? (
                            // Login Form
                            <>
                                <div className={`SoleiTic-Admin-form-group ${fieldErrors.email ? 'has-error' : ''}`}>
                                    <label htmlFor="SoleiTic-Admin-email" className="SoleiTic-Admin-form-label">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="SoleiTic-Admin-email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="SoleiTic-Admin-form-input"
                                        placeholder="admin@soleitic.com"
                                        required
                                    />
                                    {fieldErrors.email && (
                                        <div className="SoleiTic-Admin-field-error">
                                            {fieldErrors.email}
                                        </div>
                                    )}
                                </div>

                               
                                    <div className={`SoleiTic-Admin-form-group ${fieldErrors.password ? 'has-error' : ''}`}>
                                        <label htmlFor="SoleiTic-Admin-password-reg" className="SoleiTic-Admin-form-label">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="SoleiTic-Admin-password-reg"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="SoleiTic-Admin-form-input"
                                            placeholder="Minimum 12 characters"
                                            required
                                        />
                                        {fieldErrors.password && (
                                            <div className="SoleiTic-Admin-field-error">
                                                {fieldErrors.password}
                                            </div>
                                        )}

                                        {/* Password strength indicator */}
                                        {formData.password && (
                                            <div className="SoleiTic-Admin-password-strength">
                                                <div className="SoleiTic-Admin-strength-meter">
                                                    <div className={`SoleiTic-Admin-strength-meter-fill ${passwordStrength.strength}`}></div>
                                                </div>
                                                <div className={`SoleiTic-Admin-strength-text ${passwordStrength.strength}`}>
                                                    Password strength: {passwordStrength.strength.toUpperCase()}
                                                </div>

                                                {/* Password requirements */}
                                                <div className="SoleiTic-Admin-password-requirements">
                                                    <div className={`SoleiTic-Admin-requirement ${formData.password.length >= 12 ? 'met' : ''}`}>
                                                        At least 12 characters
                                                    </div>
                                                    <div className={`SoleiTic-Admin-requirement ${/[a-z]/.test(formData.password) ? 'met' : ''}`}>
                                                        One lowercase letter
                                                    </div>
                                                    <div className={`SoleiTic-Admin-requirement ${/[A-Z]/.test(formData.password) ? 'met' : ''}`}>
                                                        One uppercase letter
                                                    </div>
                                                    <div className={`SoleiTic-Admin-requirement ${/\d/.test(formData.password) ? 'met' : ''}`}>
                                                        One number
                                                    </div>
                                                    <div className={`SoleiTic-Admin-requirement ${/[@$!%*?&]/.test(formData.password) ? 'met' : ''}`}>
                                                        One special character (@$!%*?&)
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                               

                                <div className="SoleiTic-Admin-form-options">
                                    <label className="SoleiTic-Admin-form-checkbox">
                                        <input type="checkbox" name="rememberMe" />
                                        <span className="SoleiTic-Admin-checkbox-label">Remember me</span>
                                    </label>
                                    <a href="/admin/forgot-password" className="SoleiTic-Admin-form-link">
                                        Forgot Password?
                                    </a>
                                </div>
                            </>
                        ) : (
                            // Registration Form
                            <>
                                <div className="SoleiTic-Admin-form-row">
                                    <div className="SoleiTic-Admin-form-group">
                                        <label htmlFor="SoleiTic-Admin-firstName" className="SoleiTic-Admin-form-label">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="SoleiTic-Admin-firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="SoleiTic-Admin-form-input"
                                            placeholder="John"
                                            required
                                        />
                                    </div>

                                    <div className="SoleiTic-Admin-form-group">
                                        <label htmlFor="SoleiTic-Admin-lastName" className="SoleiTic-Admin-form-label">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="SoleiTic-Admin-lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="SoleiTic-Admin-form-input"
                                            placeholder="Doe"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="SoleiTic-Admin-form-group">
                                    <label htmlFor="SoleiTic-Admin-username" className="SoleiTic-Admin-form-label">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="SoleiTic-Admin-username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="SoleiTic-Admin-form-input"
                                        placeholder="johndoe_admin"
                                        required
                                    />
                                </div>

                                <div className="SoleiTic-Admin-form-group">
                                    <label htmlFor="SoleiTic-Admin-email-reg" className="SoleiTic-Admin-form-label">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="SoleiTic-Admin-email-reg"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="SoleiTic-Admin-form-input"
                                        placeholder="john.doe@soleitic.com"
                                        required
                                    />
                                </div>

                                <div className="SoleiTic-Admin-form-row">
                                    <div className="SoleiTic-Admin-form-group">
                                        <label htmlFor="SoleiTic-Admin-password-reg" className="SoleiTic-Admin-form-label">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="SoleiTic-Admin-password-reg"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="SoleiTic-Admin-form-input"
                                            placeholder="Minimum 12 characters"
                                            required
                                        />
                                    </div>

                                    <div className="SoleiTic-Admin-form-group">
                                        <label htmlFor="SoleiTic-Admin-confirmPassword" className="SoleiTic-Admin-form-label">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            id="SoleiTic-Admin-confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="SoleiTic-Admin-form-input"
                                            placeholder="Re-enter password"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="SoleiTic-Admin-form-group">
                                    <label htmlFor="SoleiTic-Admin-phone" className="SoleiTic-Admin-form-label">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="SoleiTic-Admin-phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="SoleiTic-Admin-form-input"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>

                                <div className="SoleiTic-Admin-form-group">
                                    <label htmlFor="SoleiTic-Admin-department" className="SoleiTic-Admin-form-label">
                                        Department
                                    </label>
                                    <select
                                        id="SoleiTic-Admin-department"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="SoleiTic-Admin-form-select"
                                    >
                                        <option value="management">Management</option>
                                        <option value="operations">Operations</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="sales">Sales</option>
                                        <option value="support">Support</option>
                                        <option value="technical">Technical</option>
                                    </select>
                                </div>

                                <div className="SoleiTic-Admin-form-group">
                                    <label htmlFor="SoleiTic-Admin-role" className="SoleiTic-Admin-form-label">
                                        Role
                                    </label>
                                    <select
                                        id="SoleiTic-Admin-role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="SoleiTic-Admin-form-select"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="content_manager">Content Manager</option>
                                        <option value="order_manager">Order Manager</option>
                                        <option value="product_manager">Product Manager</option>
                                        <option value="customer_support">Customer Support</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                </div>

                                {/* Advanced Options Toggle */}
                                <button
                                    type="button"
                                    className="SoleiTic-Admin-advanced-toggle"
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                >
                                    {showAdvanced ? '▲ Hide Advanced Options' : '▼ Show Advanced Options'}
                                </button>

                                {showAdvanced && (
                                    <div className="SoleiTic-Admin-advanced-section">
                                        <h3 className="SoleiTic-Admin-advanced-title">Permissions</h3>
                                        <div className="SoleiTic-Admin-permissions-grid">
                                            {modules.map(module => (
                                                <div key={module.id} className="SoleiTic-Admin-permission-module">
                                                    <h4 className="SoleiTic-Admin-permission-module-title">
                                                        {module.label}
                                                    </h4>
                                                    <div className="SoleiTic-Admin-permission-actions">
                                                        {actions.map(action => (
                                                            <label key={action} className="SoleiTic-Admin-permission-action">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={formData.permissions.some(p =>
                                                                        p.module === module.id &&
                                                                        p.actions.includes(action)
                                                                    )}
                                                                    onChange={(e) =>
                                                                        handlePermissionChange(module.id, action, e.target.checked)
                                                                    }
                                                                />
                                                                <span className="SoleiTic-Admin-permission-action-label">
                                                                    {action.charAt(0).toUpperCase() + action.slice(1)}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="SoleiTic-Admin-form-row">
                                            <div className="SoleiTic-Admin-form-group">
                                                <label className="SoleiTic-Admin-form-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        name="twoFactorAuth.enabled"
                                                        checked={formData.twoFactorAuth.enabled}
                                                        onChange={handleChange}
                                                    />
                                                    <span className="SoleiTic-Admin-checkbox-label">
                                                        Enable Two-Factor Authentication
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <button
                            type="submit"
                            className="SoleiTic-Admin-Auth-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="SoleiTic-Admin-spinner"></span>
                            ) : (
                                isLogin ? 'Sign In' : 'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="SoleiTic-Admin-Auth-footer">
                        <p className="SoleiTic-Admin-Auth-switch">
                            {isLogin ? "Don't have an admin account?" : "Already have an account?"}
                            <button
                                type="button"
                                className="SoleiTic-Admin-Auth-switch-button"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? 'Register Here' : 'Login Here'}
                            </button>
                        </p>
                        <div className="SoleiTic-Admin-security-info">
                            <span className="SoleiTic-Admin-security-icon">🔒</span>
                            <span className="SoleiTic-Admin-security-text">
                                Enterprise-grade security & encryption
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAuth;