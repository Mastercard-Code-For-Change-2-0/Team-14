import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff,FiPhone } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch('password');

 const onSubmit = async (data) => {
  setIsLoading(true);
  try {
    // Remove confirmPassword before sending to backend
    const { confirmPassword, ...payload } = data;

    const result = await registerUser(payload);
    if (result.success) {
      navigate('/dashboard');
    }
  } catch (error) {
    console.error('Registration error:', error);
  } finally {
    setIsLoading(false);
  }
};


  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us and start your journey
          </p>
        </div>

        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            
            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className={`input ${errors.firstName ? 'border-red-500' : ''}`}
                  placeholder="First name"
                  {...register('firstName', {
                    required: 'First name is required',
                    maxLength: { value: 50, message: 'Max 50 chars' }
                  })}
                />
                {errors.firstName && <p className="form-error">{errors.firstName.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className={`input ${errors.lastName ? 'border-red-500' : ''}`}
                  placeholder="Last name"
                  {...register('lastName', {
                    required: 'Last name is required',
                    maxLength: { value: 50, message: 'Max 50 chars' }
                  })}
                />
                {errors.lastName && <p className="form-error">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Username */}
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  className={`input pl-10 ${errors.username ? 'border-red-500' : ''}`}
                  placeholder="Choose a username"
                  {...register('username', {
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Min 3 characters' },
                    maxLength: { value: 30, message: 'Max 30 characters' }
                  })}
                />
              </div>
              {errors.username && <p className="form-error">{errors.username.message}</p>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  className={`input pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter your email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email format'
                    }
                  })}
                />
              </div>
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Phone</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  className={`input pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="10-digit phone number"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: { value: /^\d{10}$/, message: 'Must be 10 digits' }
                  })}
                />
              </div>
              {errors.phone && <p className="form-error">{errors.phone.message}</p>}
            </div>

            {/* College */}
            <div className="form-group">
              <label className="form-label">College</label>
              <input
                type="text"
                className={`input ${errors.college ? 'border-red-500' : ''}`}
                placeholder="Enter your college"
                {...register('college', { required: 'College is required' })}
              />
              {errors.college && <p className="form-error">{errors.college.message}</p>}
            </div>

            {/* Year of Graduation */}
            <div className="form-group">
              <label className="form-label">Year of Graduation</label>
              <input
                type="text"
                className={`input ${errors.YearOfGraduation ? 'border-red-500' : ''}`}
                placeholder="YYYY"
                {...register('YearOfGraduation', {
                  required: 'Graduation year is required',
                  pattern: { value: /^\d{4}$/, message: 'Enter valid year' }
                })}
              />
              {errors.YearOfGraduation && <p className="form-error">{errors.YearOfGraduation.message}</p>}
            </div>

            {/* Field of Study */}
            <div className="form-group">
              <label className="form-label">Field of Study</label>
              <select
                className={`input ${errors.fieldOfStudy ? 'border-red-500' : ''}`}
                {...register('fieldOfStudy', { required: 'Field of study is required' })}
              >
                <option value="">Select your field</option>
                <option>B.Tech - Computer Engineering</option>
                <option>B.Tech - Information Technology</option>
                <option>B.Tech - Electronics & Telecommunication Engineering</option>
                <option>B.Tech - Electronics & Computer Engineering</option>
                <option>B.Tech - Mechanical Engineering</option>
              </select>
              {errors.fieldOfStudy && <p className="form-error">{errors.fieldOfStudy.message}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`input pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Create a password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Min 6 characters' }
                  })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center">
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`input pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="Confirm password"
                  {...register('confirmPassword', {
                    required: 'Confirm password is required',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center">
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center items-center"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                  Sign in
                </Link>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
