import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'

import WorkoutsCell from './WorkoutsCell'

const WorkoutsPage = () => {
  return (
    <>
      <Metadata title="Workouts" robots="noindex" />

      <Tabs value="workouts" onValueChange={() => navigate(routes.workoutTemplates())}>
        <TabsList>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="workouts">
          <WorkoutsCell />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default WorkoutsPage
