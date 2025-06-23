import { navigate, routes } from '@cedarjs/router'
import { Metadata } from '@cedarjs/web'

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'

import WorkoutTemplatesCell from './WorkoutTemplatesCell'

const TemplatesPage = () => {
  return (
    <>
      <Metadata title="Workout Templates" robots="noindex" />

      <Tabs value="templates" onValueChange={() => navigate(routes.workouts())}>
        <TabsList>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <WorkoutTemplatesCell />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default TemplatesPage
