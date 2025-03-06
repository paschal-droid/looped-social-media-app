import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useCallStateHooks } from "@stream-io/video-react-bindings";
import { scaling, getFontFamily, color } from "../../themes/themes";


const {fontScale} = scaling


const formatTime = (seconds) => {
  const date = new Date(0);
  date.setSeconds(seconds);
  const format = date.toISOString();
  const hours = format.substring(11, 13);
  const minutes = format.substring(14, 16);
  const seconds_str = format.substring(17, 19);
  return `${hours !== "00" ? hours + ":" : ""}${minutes}:${seconds_str}`;
};

const CallDurationBadge = () => {
  const [elapsed, setElapsed] = useState("00:00");
  const { useCallSession } = useCallStateHooks();
  const session = useCallSession();
  const startedAt = session?.started_at;
  const startedAtDate = useMemo(() => {
    if (!startedAt) {
      return Date.now();
    }
    const date = new Date(startedAt).getTime();
    return isNaN(date) ? Date.now() : date;
  }, [startedAt]);

  useEffect(() => {
    const initialElapsedSeconds = Math.max(
      0,
      (Date.now() - startedAtDate) / 1000,
    );

    setElapsed(formatTime(initialElapsedSeconds));

    const interval = setInterval(() => {
      const elapsedSeconds = (Date.now() - startedAtDate) / 1000;
      setElapsed(formatTime(elapsedSeconds));
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAtDate]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{elapsed}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: "center"

    },
    text: {
        color: color.white,
        fontSize: fontScale(17),
        fontFamily: getFontFamily('PlusJakartaSans', '600')
    }
})

export default CallDurationBadge