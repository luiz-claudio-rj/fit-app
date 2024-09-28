import Colors from "@/constants/Colors";
import fonts from "@/constants/fonts";
import { View as DefaultView } from "react-native";
import {
  Text as DefaultText,
  TextProps as DefaultTextProps,
} from "react-native-paper";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultTextProps<any>;
export type ViewProps = ThemeProps & DefaultView["props"];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;

  return (
    <DefaultText
      style={[
        { color: Colors.onBackground, fontFamily: fonts.Inter, fontSize: 16 },
        style,
      ]}
      {...otherProps}
    />
  );
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;

  return (
    <DefaultView
      style={[{ backgroundColor: Colors.primary }, style]}
      {...otherProps}
    />
  );
}
