export interface Background {
  id: string
  name: string
  value: string
  type: "gradient" | "solid" | "texture"
  pattern?: string
}

export const backgrounds = {
  gradients: [
    {
      id: "sunset",
      name: "Sunset",
      value: "linear-gradient(135deg, #ff6b6b, #feca57, #ff9ff3)",
      type: "gradient" as const,
    },
    {
      id: "ocean",
      name: "Ocean",
      value: "linear-gradient(135deg, #667eea, #764ba2)",
      type: "gradient" as const,
    },
    {
      id: "purple-pink",
      name: "Purple",
      value: "linear-gradient(135deg, #a8edea, #fed6e3)",
      type: "gradient" as const,
    },
    {
      id: "forest",
      name: "Forest",
      value: "linear-gradient(135deg, #134e5e, #71b280)",
      type: "gradient" as const,
    },
    {
      id: "fire",
      name: "Fire",
      value: "linear-gradient(135deg, #ff9a9e, #fecfef, #fecfef)",
      type: "gradient" as const,
    },
    {
      id: "sky",
      name: "Sky",
      value: "linear-gradient(135deg, #74b9ff, #0984e3)",
      type: "gradient" as const,
    },
    {
      id: "aurora",
      name: "Aurora",
      value: "linear-gradient(135deg, #00c6ff, #0072ff, #9b59b6)",
      type: "gradient" as const,
    },
    {
      id: "tropical",
      name: "Tropical",
      value: "linear-gradient(135deg, #f093fb, #f5576c, #4facfe)",
      type: "gradient" as const,
    },
    {
      id: "mint",
      name: "Mint",
      value: "linear-gradient(135deg, #4ecdc4, #44a08d)",
      type: "gradient" as const,
    },
    {
      id: "peach",
      name: "Peach",
      value: "linear-gradient(135deg, #ffecd2, #fcb69f)",
      type: "gradient" as const,
    },
    {
      id: "cosmic",
      name: "Cosmic",
      value: "linear-gradient(135deg, #667db6, #0082c8, #0082c8, #667db6)",
      type: "gradient" as const,
    },
    {
      id: "neon",
      name: "Neon",
      value: "linear-gradient(135deg, #ff0099, #493240)",
      type: "gradient" as const,
    },
  ],

  solid: [
    { id: "white", name: "White", value: "#ffffff", type: "solid" as const },
    { id: "black", name: "Black", value: "#000000", type: "solid" as const },
    { id: "gray", name: "Gray", value: "#6b7280", type: "solid" as const },
    { id: "red", name: "Red", value: "#ef4444", type: "solid" as const },
    { id: "blue", name: "Blue", value: "#3b82f6", type: "solid" as const },
    { id: "green", name: "Green", value: "#10b981", type: "solid" as const },
    { id: "yellow", name: "Yellow", value: "#f59e0b", type: "solid" as const },
    { id: "purple", name: "Purple", value: "#8b5cf6", type: "solid" as const },
    { id: "pink", name: "Pink", value: "#ec4899", type: "solid" as const },
    { id: "indigo", name: "Indigo", value: "#6366f1", type: "solid" as const },
    { id: "teal", name: "Teal", value: "#14b8a6", type: "solid" as const },
    { id: "orange", name: "Orange", value: "#f97316", type: "solid" as const },
  ],

  textures: [
    {
      id: "paper",
      name: "Paper",
      value: "#f8f9fa",
      type: "texture" as const,
      pattern:
        "url(data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e9ecef' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E)",
    },
    {
      id: "fabric",
      name: "Fabric",
      value: "#f1f3f4",
      type: "texture" as const,
      pattern:
        "url(data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d1d5db' fill-opacity='0.3'%3E%3Cpath d='M0 0h20v20H0V0zm10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14z'/%3E%3C/g%3E%3C/svg%3E)",
    },
    {
      id: "wood",
      name: "Wood",
      value: "#8b4513",
      type: "texture" as const,
      pattern:
        "url(data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23654321' fill-opacity='0.2'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/svg%3E)",
    },
    {
      id: "metal",
      name: "Metal",
      value: "#9ca3af",
      type: "texture" as const,
      pattern:
        "url(data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236b7280' fill-opacity='0.3'%3E%3Cpath d='M0 0h10v10H0V0zm10 10h10v10H10V10z'/%3E%3C/g%3E%3C/svg%3E)",
    },
    {
      id: "dots",
      name: "Dots",
      value: "#f8f9fa",
      type: "texture" as const,
      pattern: "radial-gradient(circle, #dee2e6 1px, transparent 1px)",
    },
    {
      id: "grid",
      name: "Grid",
      value: "#ffffff",
      type: "texture" as const,
      pattern: "linear-gradient(#e9ecef 1px, transparent 1px), linear-gradient(90deg, #e9ecef 1px, transparent 1px)",
    },
  ],
}
