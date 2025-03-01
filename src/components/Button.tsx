import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  size = 'md',
  disabled,
  style,
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'py-2 px-3',
    md: 'py-3 px-4',
    lg: 'py-4 px-6',
  };

  // Text size classes
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  // Base classes for all buttons
  const baseClasses = `rounded-full ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''}`;
  
  // Variant specific classes
  const variantClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    outline: 'border-2 border-primary-500 bg-transparent',
  };

  // Text classes
  const textClasses = `font-semibold text-center ${textSizeClasses[size]} ${
    variant === 'outline' ? 'text-primary-500' : 'text-white'
  }`;

  if (variant === 'primary' || variant === 'secondary') {
    const gradientColors = variant === 'primary' 
      ? ['#ec4899', '#db2777'] 
      : ['#0ea5e9', '#0369a1'];
    
    return (
      <TouchableOpacity
        className={`${baseClasses} ${disabled ? 'opacity-50' : ''}`}
        disabled={disabled || isLoading}
        style={style}
        {...props}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-full items-center justify-center w-full h-full"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className={textClasses}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50' : ''}`}
      disabled={disabled || isLoading}
      style={style}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? '#ec4899' : 'white'} />
      ) : (
        <Text className={textClasses}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button; 