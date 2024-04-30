function average(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

type Timestamp = number | `${number}`;

export function getTimestamp(ms: Timestamp | Timestamp[]) {
  if (Array.isArray(ms)) return getTimestamp(average(ms.map((m) => Number(m))));
  ms = Number(ms);
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  const w = Math.floor(d / 7);
  const y = Math.floor(d / 365.24);
  const M = Math.floor(y * 12);
  const o = {
    timestamp: ms,
    ms,
    milliseconds: ms,
    millisecond: ms % 1000,
    s,
    seconds: s,
    second: s % 60,
    m,
    minutes: m,
    minute: m % 60,
    h,
    hours: h,
    hour: h % 24,
    d,
    days: d,
    day: d % 7,
    w,
    weeks: w,
    week: w % 4,
    M,
    months: M,
    month: M % 12,
    y,
    years: y,
    year: y % 100,
    raw: {
      ms,
      s: ms / 1000,
      m: ms / 1000 / 60,
      h: ms / 1000 / 60 / 60,
      d: ms / 1000 / 60 / 60 / 24,
      w: ms / 1000 / 60 / 60 / 24 / 7,
      M: (ms / 1000 / 60 / 60 / 24 / 365.24) * 12,
      y: ms / 1000 / 60 / 60 / 24 / 365.24,
    },
  };
  const msStr = o.millisecond ? `${o.millisecond}ms` : "";
  const sStr = o.second ? `${o.second}s` : "";
  const mStr = o.minute ? `${o.minute}m` : "";
  const hStr = o.hour ? `${o.hour}h` : "";
  const dStr = o.day ? `${o.day}d` : "";
  const wStr = o.week ? `${o.week}w` : "";
  const MStr = o.month ? `${o.month}M` : "";
  const yStr = o.year ? `${o.year}y` : "";
  const str = [yStr, MStr, wStr, dStr, hStr, mStr, sStr, msStr];
  const string = str.join("");
  return Object.assign(string, o, {
    msStr,
    sStr,
    mStr,
    hStr,
    dStr,
    wStr,
    MStr,
    yStr,
    str,
    string,
    format: string,
  });
}

export const timestamp = getTimestamp;
