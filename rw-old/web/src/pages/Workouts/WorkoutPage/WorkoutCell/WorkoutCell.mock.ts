export const standard = () => ({
  workout: {
    id: 1,
    name: 'Full Body',
    date: '2023-11-01',
    startTime: '14:00:00.000Z',
    endTime: '15:00:15.000Z',
    durationInSeconds: 3615,
    exercises: [
      {
        id: 1,
        order: 1,
        sets: [
          {
            id: 1,
            weightInKg: 50,
            reps: 12,
            restInSeconds: 90,
          },
          {
            id: 2,
            weightInKg: 50,
            reps: 12,
            restInSeconds: 90,
          },
          {
            id: 3,
            weightInKg: 50,
            reps: 12,
            restInSeconds: 90,
          },
        ],
        exercise: {
          id: 1,
          name: '3/4 Sit-Up',
          instructions: [
            'Lie down on the floor and secure your feet. Your legs should be bent at the knees.',
            'Place your hands behind or to the side of your head. You will begin with your back on the ground. This will be your starting position.',
            'Flex your hips and spine to raise your torso toward your knees.',
            'At the top of the contraction your torso should be perpendicular to the ground. Reverse the motion, going only ¾ of the way down.',
            'Repeat for the recommended amount of repetitions.',
          ],
          gifUrl: 'http://localhost:9000/omnifex/exercises/3-4-sit-up.gif',
        },
      },
      {
        id: 2,
        order: 2,
        sets: [
          {
            id: 4,
            weightInKg: 50,
            reps: 12,
            restInSeconds: 90,
          },
          {
            id: 5,
            weightInKg: 50,
            reps: 12,
            restInSeconds: 90,
          },
          {
            id: 6,
            weightInKg: 50,
            reps: 12,
            restInSeconds: 90,
          },
        ],
        exercise: {
          id: 2,
          name: '90/90 Hamstring',
          instructions: [
            'Lie on your back, with one leg extended straight out.',
            'With the other leg, bend the hip and knee to 90 degrees. You may brace your leg with your hands if necessary. This will be your starting position.',
            'Extend your leg straight into the air, pausing briefly at the top. Return the leg to the starting position.',
            'Repeat for 10-20 repetitions, and then switch to the other leg.',
          ],
          gifUrl: 'http://localhost:9000/omnifex/exercises/90-90-hamstring.gif',
        },
      },
      {
        id: 3,
        order: 3,
        sets: [
          {
            id: 7,
            weightInKg: 50,
            reps: 12,
            restInSeconds: 90,
          },
          {
            id: 8,
            weightInKg: 50,
            reps: 12,
            restInSeconds: 90,
          },
          {
            id: 9,
            weightInKg: 50,
            reps: 12,
            restInSeconds: 90,
          },
        ],
        exercise: {
          id: 3,
          name: 'Ab Crunch Machine',
          instructions: [
            'Select a light resistance and sit down on the ab machine placing your feet under the pads provided and grabbing the top handles. Your arms should be bent at a 90 degree angle as you rest the triceps on the pads provided. This will be your starting position.',
            'At the same time, begin to lift the legs up as you crunch your upper torso. Breathe out as you perform this movement. Tip: Be sure to use a slow and controlled motion. Concentrate on using your abs to move the weight while relaxing your legs and feet.',
            'After a second pause, slowly return to the starting position as you breathe in.',
            'Repeat the movement for the prescribed amount of repetitions.',
          ],
          gifUrl: 'http://localhost:9000/omnifex/exercises/ab-crunch-machine.gif',
        },
      },
      {
        id: 4,
        order: 4,
        sets: [
          {
            id: 10,
            weightInKg: 50,
            reps: 12,
            restInSeconds: 90,
          },
          {
            id: 11,
            weightInKg: 50,
            reps: 12,
            restInSeconds: 90,
          },
          {
            id: 12,
            weightInKg: 50,
            reps: 12,
            restInSeconds: 90,
          },
        ],
        exercise: {
          id: 4,
          name: 'Ab Roller',
          instructions: [
            'Hold the Ab Roller with both hands and kneel on the floor.',
            'Now place the ab roller on the floor in front of you so that you are on all your hands and knees (as in a kneeling push up position). This will be your starting position.',
            'Slowly roll the ab roller straight forward, stretching your body into a straight position. Tip: Go down as far as you can without touching the floor with your body. Breathe in during this portion of the movement.',
            'After a pause at the stretched position, start pulling yourself back to the starting position as you breathe out. Tip: Go slowly and keep your abs tight at all times.',
          ],
          gifUrl: 'http://localhost:9000/omnifex/exercises/ab-roller.gif',
        },
      },
    ],
  },
})
