export const intervals = [
  {
    weekDay: 0,
    enabled: false,
    startTime: '08:00',
    endTime: '18:00',
  },
  {
    weekDay: 1,
    enabled: true,
    startTime: '08:00',
    endTime: '18:00',
  },
  {
    weekDay: 2,
    enabled: true,
    startTime: '08:00',
    endTime: '18:00',
  },
  {
    weekDay: 3,
    enabled: true,
    startTime: '08:00',
    endTime: '18:00',
  },
  {
    weekDay: 4,
    enabled: true,
    startTime: '08:00',
    endTime: '18:00',
  },
  {
    weekDay: 5,
    enabled: true,
    startTime: '08:00',
    endTime: '18:00',
  },
  {
    weekDay: 6,
    enabled: false,
    startTime: '08:00',
    endTime: '18:00',
  },
]

interface GetWeekDaysParams {
  short?: boolean
}

export function getWeekDays({ short = false }: GetWeekDaysParams = {}) {
  const formatter = new Intl.DateTimeFormat('en-CA', { weekday: 'long' })

  return Array.from(Array(7).keys())
    .map((day) => formatter.format(new Date(Date.UTC(2021, 5, day))))
    .map((weekDay) => {
      if (short) {
        return weekDay.substring(0, 3).toUpperCase()
      }

      return weekDay.substring(0, 1).toUpperCase().concat(weekDay.substring(1))
    })
}
