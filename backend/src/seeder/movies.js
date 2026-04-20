export const moviesData = [
  {
    title: "Inception",
    genres: ["Sci-Fi", "Thriller"],
    languages: ["English", "Hindi"],
    duration: 148,
    releaseDate: new Date("2010-07-16"),
    certification: "UA",
    rating: 8.8,
    director: ["Christopher Nolan"],
    cast: [
      { name: "Leonardo DiCaprio", role: "Cobb" },
      { name: "Joseph Gordon-Levitt", role: "Arthur" }
    ]
  },
  {
    title: "Interstellar",
    genres: ["Sci-Fi", "Drama"],
    languages: ["English"],
    duration: 169,
    releaseDate: new Date("2014-11-07"),
    certification: "UA",
    rating: 8.6,
    director: ["Christopher Nolan"],
    cast: [
      { name: "Matthew McConaughey", role: "Cooper" }
    ]
  },
  {
    title: "Avengers: Endgame",
    genres: ["Action", "Adventure"],
    languages: ["English", "Hindi", "Tamil"],
    duration: 181,
    releaseDate: new Date("2019-04-26"),
    certification: "UA",
    rating: 8.4,
    director: ["Russo Brothers"],
    cast: [
      { name: "Robert Downey Jr.", role: "Iron Man" }
    ]
  },

  // 👉 Add more (keep realistic)
  {
    title: "Jawan",
    genres: ["Action", "Thriller"],
    languages: ["Hindi", "Tamil"],
    duration: 165,
    releaseDate: new Date("2023-09-07"),
    certification: "UA",
    rating: 7.5,
    director: ["Atlee"],
    cast: [{ name: "Shah Rukh Khan", role: "Lead" }]
  },
  {
    title: "Pathaan",
    genres: ["Action"],
    languages: ["Hindi"],
    duration: 146,
    releaseDate: new Date("2023-01-25"),
    certification: "UA",
    rating: 6.8,
    director: ["Siddharth Anand"],
    cast: [{ name: "Shah Rukh Khan", role: "Pathaan" }]
  },

  // 🔥 Generate more dummy realistic entries
  ...Array.from({ length: 15 }).map((_, i) => ({
    title: `Sample Movie ${i + 1}`,
    genres: ["Drama"],
    languages: ["Hindi"],
    duration: 120 + i,
    releaseDate: new Date(`2022-01-${(i % 28) + 1}`),
    certification: "U",
    rating: Math.random() * 10,
    director: ["Director Name"],
    cast: [{ name: "Actor Name", role: "Lead" }]
  }))
]