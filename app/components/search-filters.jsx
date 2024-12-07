import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'

export function SearchFilters({ onSearch }) {
  const [year, setYear] = React.useState(new Date().getFullYear().toString())
  const [month, setMonth] = React.useState('all')

  const months = [
    'All Months',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const handleSearch = () => {
    onSearch(year, month === 'all' ? null : parseInt(month))
  }

  return (
    <div className="flex gap-4 p-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="year" className="text-sm font-medium">
          Year
        </label>
        <Input
          id="year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-32"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="month" className="text-sm font-medium">
          Month
        </label>
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m, index) => (
              <SelectItem key={index} value={index === 0 ? 'all' : index.toString()}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        className="mt-auto"
        onClick={handleSearch}
      >
        Search
      </Button>
    </div>
  )
}