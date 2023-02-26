import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'

import { Calendar } from '@/components/Calendar'
import { api } from '@/lib/axios'
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles'

interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

interface CalendarStepsProps {
  onSelectDateTime: (date: Date) => void
}

export function CalendarStep({ onSelectDateTime }: CalendarStepsProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const router = useRouter()

  const isDateSelected = !!selectedDate
  const username = String(router.query.username)

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const formattedDate = selectedDate
    ? dayjs(selectedDate).format('MMMM, DD')
    : null

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  const { data: availability } = useQuery<Availability>(
    ['availability', selectedDateWithoutTime],
    async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        },
      })

      return response.data
    },
    {
      enabled: !!selectedDate,
    },
  )

  function handleSelectTime(hour) {
    const dateWithTime = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate()

    onSelectDateTime(dateWithTime)
  }

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected ? (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{formattedDate}</span>
          </TimePickerHeader>

          <TimePickerList>
            {availability?.possibleTimes?.map((hour) => {
              const now = dayjs().startOf('day')
              const nowDate = now.add(hour, 'hour').add(0, 'minutes')
              const formattedHour = dayjs(nowDate).format('hh:mm a')

              return (
                <TimePickerItem
                  key={hour}
                  disabled={!availability?.availableTimes.includes(hour)}
                  onClick={() => handleSelectTime(hour)}
                >
                  {formattedHour}
                </TimePickerItem>
              )
            })}
          </TimePickerList>
        </TimePicker>
      ) : null}
    </Container>
  )
}
