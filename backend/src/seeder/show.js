export const generateShows = (movies, theatres, screens) => {
  const shows = []

  movies.forEach((movie) => {
    for (let i = 0; i < 3; i++) {
      shows.push({
        movie: movie._id,
        theatre: theatres[Math.floor(Math.random() * theatres.length)],
        screen: screens[Math.floor(Math.random() * screens.length)],
        showTime: new Date(Date.now() + i * 3 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + (i * 3 + 2) * 60 * 60 * 1000),
        priceMultiplier: [1, 1.2, 1.5][Math.floor(Math.random() * 3)]
      })
    }
  })

  return shows
}