import React from 'react';
import { View, Text, TouchableOpacity, ViewProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CardProps extends ViewProps {
  title?: string;
  children: React.ReactNode;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  footer?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  onPress,
  icon,
  iconColor = '#ec4899',
  footer,
  variant = 'default',
  style,
  ...props
}) => {
  // Base classes for all cards
  const baseClasses = 'rounded-xl p-4 bg-white';
  
  // Variant specific classes
  const variantClasses = {
    default: '',
    elevated: 'shadow-md',
    outlined: 'border border-gray-200',
  };

  const cardContent = (
    <View className={`${baseClasses} ${variantClasses[variant]}`} style={style} {...props}>
      {(title || icon) && (
        <View className="flex-row items-center mb-2">
          {icon && <Ionicons name={icon} size={20} color={iconColor} className="mr-2" />}
          {title && <Text className="text-lg font-semibold text-gray-800">{title}</Text>}
        </View>
      )}
      <View>{children}</View>
      {footer && <View className="mt-3 pt-3 border-t border-gray-100">{footer}</View>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

export default Card; 