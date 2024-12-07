
import * as React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { SearchFilters } from '@/app/components/search-filters'
import { Button } from '@/app/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { Input } from '@/app/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'

const categories = [
  'Housing',
  'Utilities',
  'Transportation',
  'Groceries',
  'Health',
  'Insurance',
  'Debt',
  'Savings',
  'Education',
  'Clothing',
  'Taxes',
  'Others',
]

export function ExpensesTab() {
  const [expenses, setExpenses] = React.useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [newExpense, setNewExpense] = React.useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    name: '',
    category: categories[0],
    amount: '',
    quantity: 1
  })

  const fetchExpenses = async (year, month) => {
    try {
      let url = '/api/expenses'
      if (year) {
        url += `?year=${year}`
        if (month) {
          url += `&month=${month}`
        }
      }
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch expenses')
      const data = await response.json()
      setExpenses(data)
    } catch (error) {
      console.error('Error fetching expenses:', error)
    }
  }

  React.useEffect(() => {
    fetchExpenses()
  }, [])

  const handleSearch = (year, month) => {
    fetchExpenses(year, month)
  }

  const handleAddExpense = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense),
      })
      if (!response.ok) throw new Error('Failed to add expense')
      setIsAddDialogOpen(false)
      fetchExpenses()
    } catch (error) {
      console.error('Error adding expense:', error)
    }
  }

  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(`/api/expenses?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete expense')
      fetchExpenses()
    } catch (error) {
      console.error('Error deleting expense:', error)
    }
  }

  return (
    <div className="space-y-4">
      <SearchFilters onSearch={handleSearch} />
      
      <div className="flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="year" className="text-sm font-medium">
                    Year
                  </label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    value={newExpense.year}
                    onChange={(e) => setNewExpense({...newExpense, year: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="month" className="text-sm font-medium">
                    Month
                  </label>
                  <Input
                    id="month"
                    name="month"
                    type="number"
                    min="1"
                    max="12"
                    value={newExpense.month}
                    onChange={(e) => setNewExpense({...newExpense, month: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="day" className="text-sm font-medium">
                    Day
                  </label>
                  <Input
                    id="day"
                    name="day"
                    type="number"
                    min="1"
                    max="31"
                    value={newExpense.day}
                    onChange={(e) => setNewExpense({...newExpense, day: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input 
                  id="name" 
                  name="name" 
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Select 
                  name="category" 
                  value={newExpense.category}
                  onValueChange={(value) => setNewExpense({...newExpense, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="amount" className="text-sm font-medium">
                    Amount ($)
                  </label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="quantity" className="text-sm font-medium">
                    Quantity
                  </label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={newExpense.quantity}
                    onChange={(e) => setNewExpense({...newExpense, quantity: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Add Expense
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>
                {expense.year}/{expense.month}/{expense.day}
              </TableCell>
              <TableCell>{expense.name}</TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell>${Number(expense.amount).toFixed(2)}</TableCell>
              <TableCell>{expense.quantity}</TableCell>
              <TableCell>
                ${(expense.amount * expense.quantity).toFixed(2)}
              </TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteExpense(expense.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

