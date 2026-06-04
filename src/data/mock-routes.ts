export type RideType = "flat" | "rolling" | "hilly" | "mountainous";

export interface RoutePoint {
  lat: number;
  lng: number;
  elevation: number;
}

export interface ClimbSegment {
  name: string;
  distance: number;
  elevationGain: number;
  avgGradient: number;
  maxGradient: number;
  category: "Cat 4" | "Cat 3" | "Cat 2" | "Cat 1" | "HC";
}

export interface RideEntry {
  id: string;
  date: string;
  notes: string;
  rating: number;
  weather?: string;
  stravaUrl?: string;
}

export interface Route {
  id: string;
  name: string;
  location: string;
  city: string;
  distance: number;
  elevationGain: number;
  elevationLoss: number;
  maxGradient: number;
  avgGradient: number;
  minElevation: number;
  maxElevation: number;
  difficulty: number;
  experienceRating: number;
  rideType: RideType;
  tags: string[];
  rideCount: number;
  lastRidden: string | null;
  importDate: string;
  coverColor: string;
  climbs: ClimbSegment[];
  rideEntries: RideEntry[];
  elevationProfile: Array<{ distance: number; elevation: number }>;
}

export const mockRoutes: Route[] = [
  {
    id: "1",
    name: "太湖环湖骑行",
    location: "苏州市 · 吴中区",
    city: "苏州",
    distance: 142.5,
    elevationGain: 320,
    elevationLoss: 318,
    maxGradient: 8.2,
    avgGradient: 1.5,
    minElevation: 2,
    maxElevation: 68,
    difficulty: 2,
    experienceRating: 4,
    rideType: "flat",
    tags: ["平路", "环湖", "好路", "风景好", "适合新手"],
    rideCount: 5,
    lastRidden: "2026-05-18",
    importDate: "2025-03-15",
    coverColor: "#0ea5e9",
    climbs: [],
    rideEntries: [
      {
        id: "r1-1",
        date: "2026-05-18",
        notes: "天气晴好，顺时针环湖，太湖大桥风景绝美。西山段路况很好，适合巡航。",
        rating: 5,
        weather: "晴",
        stravaUrl: "https://strava.com/activities/12345678",
      },
      {
        id: "r1-2",
        date: "2026-04-02",
        notes: "逆时针骑，西山段有些路段在修路，灰尘大。下次还是顺时针好。",
        rating: 3,
        weather: "多云",
      },
    ],
    elevationProfile: Array.from({ length: 100 }, (_, i) => ({
      distance: i * 1.425,
      elevation: 5 + Math.sin(i * 0.15) * 15 + Math.random() * 8,
    })),
  },
  {
    id: "2",
    name: "莫干山爬坡挑战",
    location: "湖州市 · 德清县",
    city: "湖州",
    distance: 68.3,
    elevationGain: 1250,
    elevationLoss: 1248,
    maxGradient: 18.5,
    avgGradient: 4.2,
    minElevation: 35,
    maxElevation: 720,
    difficulty: 4,
    experienceRating: 5,
    rideType: "mountainous",
    tags: ["山地", "爬坡", "山路", "挑战", "风景好"],
    rideCount: 2,
    lastRidden: "2026-04-20",
    importDate: "2025-06-10",
    coverColor: "#10b981",
    climbs: [
      {
        name: "莫干山主坡",
        distance: 8.5,
        elevationGain: 580,
        avgGradient: 6.8,
        maxGradient: 18.5,
        category: "Cat 1",
      },
      {
        name: "后山回转",
        distance: 5.2,
        elevationGain: 320,
        avgGradient: 6.2,
        maxGradient: 14.0,
        category: "Cat 2",
      },
    ],
    rideEntries: [
      {
        id: "r2-1",
        date: "2026-04-20",
        notes: "主坡连续发卡弯，最后2km平均12%，非常酸爽。下坡要小心碎石。山顶风景值得。",
        rating: 5,
        weather: "晴",
        stravaUrl: "https://strava.com/activities/23456789",
      },
    ],
    elevationProfile: Array.from({ length: 100 }, (_, i) => {
      const x = i / 100;
      const base =
        x < 0.3
          ? 35 + x * 2000
          : x < 0.5
            ? 635 + Math.sin(x * 10) * 60
            : x < 0.7
              ? 650 - (x - 0.5) * 1500
              : x < 0.85
                ? 350 + Math.sin(x * 8) * 100
                : 350 - (x - 0.85) * 2000;
      return { distance: i * 0.683, elevation: Math.max(35, base) };
    }),
  },
  {
    id: "3",
    name: "千岛湖绿道",
    location: "杭州市 · 淳安县",
    city: "杭州",
    distance: 96.0,
    elevationGain: 680,
    elevationLoss: 675,
    maxGradient: 12.0,
    avgGradient: 2.3,
    minElevation: 100,
    maxElevation: 280,
    difficulty: 3,
    experienceRating: 4,
    rideType: "rolling",
    tags: ["起伏", "绿道", "好路", "环湖", "gravel"],
    rideCount: 3,
    lastRidden: "2026-05-25",
    importDate: "2025-04-08",
    coverColor: "#8b5cf6",
    climbs: [
      {
        name: "淳安段起伏",
        distance: 3.8,
        elevationGain: 180,
        avgGradient: 4.7,
        maxGradient: 12.0,
        category: "Cat 3",
      },
    ],
    rideEntries: [
      {
        id: "r3-1",
        date: "2026-05-25",
        notes: "沿湖绿道骑行，部分路段有 gravel 路面，带35c胎刚好。湖边风大。",
        rating: 4,
        weather: "阴",
      },
    ],
    elevationProfile: Array.from({ length: 100 }, (_, i) => ({
      distance: i * 0.96,
      elevation: 100 + Math.sin(i * 0.08) * 40 + Math.sin(i * 0.25) * 25 + Math.random() * 10,
    })),
  },
  {
    id: "4",
    name: "佘山小绕圈",
    location: "上海市 · 松江区",
    city: "上海",
    distance: 32.0,
    elevationGain: 85,
    elevationLoss: 83,
    maxGradient: 6.0,
    avgGradient: 0.8,
    minElevation: 3,
    maxElevation: 45,
    difficulty: 1,
    experienceRating: 3,
    rideType: "flat",
    tags: ["平路", "休闲", "好路", "适合新手", "短途"],
    rideCount: 12,
    lastRidden: "2026-06-01",
    importDate: "2025-01-20",
    coverColor: "#f97316",
    climbs: [],
    rideEntries: [
      {
        id: "r4-1",
        date: "2026-06-01",
        notes: "晨骑恢复，路面好，适合 ftp 测试。佘山那个小坡热热身刚好。",
        rating: 3,
        weather: "晴",
      },
    ],
    elevationProfile: Array.from({ length: 100 }, (_, i) => ({
      distance: i * 0.32,
      elevation: 3 + Math.sin(i * 0.3) * 8 + Math.random() * 3,
    })),
  },
  {
    id: "5",
    name: "皖南川藏线",
    location: "宣城市 · 宁国市",
    city: "宣城",
    distance: 120.0,
    elevationGain: 2100,
    elevationLoss: 2095,
    maxGradient: 22.0,
    avgGradient: 3.8,
    minElevation: 80,
    maxElevation: 1080,
    difficulty: 5,
    experienceRating: 5,
    rideType: "mountainous",
    tags: ["山地", "经典路线", "山路", "挑战", "烂路", "风景好"],
    rideCount: 1,
    lastRidden: "2026-03-15",
    importDate: "2025-09-01",
    coverColor: "#ef4444",
    climbs: [
      {
        name: "桃岭公路",
        distance: 12.0,
        elevationGain: 780,
        avgGradient: 6.5,
        maxGradient: 22.0,
        category: "HC",
      },
      {
        name: "储家滩爬坡",
        distance: 6.5,
        elevationGain: 420,
        avgGradient: 6.5,
        maxGradient: 16.0,
        category: "Cat 1",
      },
    ],
    rideEntries: [
      {
        id: "r5-1",
        date: "2026-03-15",
        notes: "桃岭72拐名不虚传，连续发卡弯爬升，最后几km想推车。值得再来，建议带够水。",
        rating: 5,
        weather: "多云",
        stravaUrl: "https://strava.com/activities/34567890",
      },
    ],
    elevationProfile: Array.from({ length: 100 }, (_, i) => {
      const x = i / 100;
      return {
        distance: i * 1.2,
        elevation:
          80 +
          Math.sin(x * Math.PI * 2) * 300 +
          Math.sin(x * Math.PI * 5) * 200 +
          x * 600,
      };
    }),
  },
  {
    id: "6",
    name: "西湖群山绕行",
    location: "杭州市 · 西湖区",
    city: "杭州",
    distance: 45.0,
    elevationGain: 520,
    elevationLoss: 518,
    maxGradient: 15.0,
    avgGradient: 2.8,
    minElevation: 8,
    maxElevation: 260,
    difficulty: 3,
    experienceRating: 4,
    rideType: "hilly",
    tags: ["丘陵", "市区", "山路", "风景好", "短途"],
    rideCount: 7,
    lastRidden: "2026-05-10",
    importDate: "2025-02-14",
    coverColor: "#06b6d4",
    climbs: [
      {
        name: "龙井爬坡",
        distance: 2.5,
        elevationGain: 150,
        avgGradient: 6.0,
        maxGradient: 15.0,
        category: "Cat 3",
      },
    ],
    rideEntries: [],
    elevationProfile: Array.from({ length: 100 }, (_, i) => ({
      distance: i * 0.45,
      elevation: 8 + Math.abs(Math.sin(i * 0.12)) * 120 + Math.random() * 15,
    })),
  },
  {
    id: "7",
    name: "崇明岛东滩湿地",
    location: "上海市 · 崇明区",
    city: "上海",
    distance: 88.0,
    elevationGain: 45,
    elevationLoss: 43,
    maxGradient: 2.0,
    avgGradient: 0.2,
    minElevation: 1,
    maxElevation: 8,
    difficulty: 1,
    experienceRating: 3,
    rideType: "flat",
    tags: ["平路", "湿地", "好路", "休闲", "无车"],
    rideCount: 4,
    lastRidden: "2026-04-05",
    importDate: "2025-05-20",
    coverColor: "#14b8a6",
    climbs: [],
    rideEntries: [
      {
        id: "r7-1",
        date: "2026-04-05",
        notes: "春天去东滩看候鸟，风很大但很舒服。路况极好，全程平路。",
        rating: 4,
        weather: "晴",
      },
    ],
    elevationProfile: Array.from({ length: 100 }, (_, i) => ({
      distance: i * 0.88,
      elevation: 1 + Math.random() * 3,
    })),
  },
  {
    id: "8",
    name: "天荒坪夜骑",
    location: "湖州市 · 安吉县",
    city: "湖州",
    distance: 55.0,
    elevationGain: 980,
    elevationLoss: 978,
    maxGradient: 16.0,
    avgGradient: 4.5,
    minElevation: 120,
    maxElevation: 900,
    difficulty: 4,
    experienceRating: 4,
    rideType: "mountainous",
    tags: ["山地", "爬坡", "夜骑", "挑战", "gravel"],
    rideCount: 1,
    lastRidden: "2026-05-30",
    importDate: "2026-01-15",
    coverColor: "#a855f7",
    climbs: [
      {
        name: "天荒坪盘山",
        distance: 18.0,
        elevationGain: 780,
        avgGradient: 4.3,
        maxGradient: 16.0,
        category: "Cat 1",
      },
    ],
    rideEntries: [
      {
        id: "r8-1",
        date: "2026-05-30",
        notes: "夜骑天荒坪，头灯是必须的。山顶看星空绝了，下山要特别注意安全。",
        rating: 5,
        weather: "晴",
        stravaUrl: "https://strava.com/activities/45678901",
      },
    ],
    elevationProfile: Array.from({ length: 100 }, (_, i) => {
      const x = i / 100;
      return {
        distance: i * 0.55,
        elevation: 120 + (x < 0.6 ? x * 1300 : (1 - x) * 1950),
      };
    }),
  },
];

export const rideTypeLabels: Record<RideType, string> = {
  flat: "平路",
  rolling: "起伏",
  hilly: "丘陵",
  mountainous: "山地",
};

export const rideTypeColors: Record<RideType, string> = {
  flat: "#0ea5e9",
  rolling: "#f59e0b",
  hilly: "#f97316",
  mountainous: "#ef4444",
};

export const allTags = [
  "平路",
  "起伏",
  "丘陵",
  "山地",
  "好路",
  "烂路",
  "gravel",
  "风景好",
  "适合新手",
  "挑战",
  "山路",
  "环湖",
  "绿道",
  "休闲",
  "短途",
  "爬坡",
  "无车",
  "湿地",
  "经典路线",
  "夜骑",
  "市区",
];
