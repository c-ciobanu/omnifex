import { Metadata } from '@redwoodjs/web'

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'

import WorkoutsCell from './WorkoutsCell'
import WorkoutTemplatesCell from './WorkoutTemplatesCell'

const WorkoutsPage = () => {
  return (
    <>
      <Metadata title="Workouts" robots="noindex" />

      <Tabs defaultValue="workouts">
        <TabsList>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="workouts">
          <WorkoutsCell />
        </TabsContent>
        <TabsContent value="templates">
          <WorkoutTemplatesCell />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default WorkoutsPage
