'use client'

import * as React from 'react'
import { LayoutDashboard, Receipt } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/app/components/ui/sidebar'
import { SummaryTab } from '@/app/components/summary-tab'
import { ExpensesTab } from '@/app/components/expenses-tab'

export default function ExpenseTracker() {
  const [activeTab, setActiveTab] = React.useState('summary')

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader>
            <h2 className="px-6 text-lg font-semibold tracking-tight">
              Expense Tracker
            </h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveTab('summary')}
                  isActive={activeTab === 'summary'}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Summary</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveTab('expenses')}
                  isActive={activeTab === 'expenses'}
                >
                  <Receipt className="mr-2 h-4 w-4" />
                  <span>Expenses</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'summary' ? <SummaryTab /> : <ExpensesTab />}
        </main>
      </div>
    </SidebarProvider>
  )
}

