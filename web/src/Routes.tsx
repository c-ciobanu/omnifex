// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { PrivateSet, Route, Router, Set } from '@redwoodjs/router'

import UnauthenticatedRoute from 'src/components/UnauthenticatedRoute/UnauthenticatedRoute'
import AppLayout from 'src/layouts/AppLayout/AppLayout'

import { useAuth } from './auth'

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Set wrap={AppLayout}>
        <Set wrap={UnauthenticatedRoute}>
          <Route path="/login" page={AuthLoginPage} name="login" />
          <Route path="/signup" page={AuthSignupPage} name="signup" />
          {/* <Route path="/forgot-password" page={AuthForgotPasswordPage} name="forgotPassword" /> */}
          {/* <Route path="/reset-password" page={AuthResetPasswordPage} name="resetPassword" /> */}
          <Route path="/login/demo" page={AuthDemoUserLoginPage} name="demoUserLogin" />

          <Route path="/" page={HomePage} name="home" />
        </Set>

        <Route path="/search/movies" page={MoviesSearchMoviesPage} name="searchMovies" />
        <Route path="/search/shows" page={ShowsSearchShowsPage} name="searchShows" />
        <Route path="/search/books" page={BooksSearchBooksPage} name="searchBooks" />
        <Route path="/movies/{tmdbId:Int}" page={MoviesMoviePage} name="movie" />
        <Route path="/shows/{tmdbId:Int}" page={ShowsShowPage} name="show" />
        <Route path="/shows/{tmdbId:Int}/seasons/{number:Int}" page={ShowsSeasonPage} name="season" />
        <Route path="/books/{googleId:String}" page={BooksBookPage} name="book" />
        <Route path="/documents/{id:String}" page={DocumentsDocumentPage} name="document" />
        <Route path="/tools/pomodoro" page={PomodoroTimerPage} name="pomodoro" />
        <Route path="/invoices" page={InvoicesInvoicesPage} name="invoices" />
        <Route path="/invoices/new" page={InvoicesNewInvoicePage} name="newInvoice" />
        <Route path="/invoices/{id:String}" page={InvoicesInvoicePage} name="invoice" />

        <PrivateSet unauthenticated="home">
          <Route path="/movies" page={MoviesMoviesPage} name="movies" />
          <Route path="/shows" page={ShowsShowsPage} name="shows" />
          <Route path="/books" page={BooksBooksPage} name="books" />
          <Route path="/documents" page={DocumentsDocumentsPage} name="documents" />
          <Route path="/metrics" page={MetricsMetricsPage} name="metrics" />
          <Route path="/metrics/{id:Int}" page={MetricsMetricPage} name="metric" />
          <Route path="/workouts/templates" page={WorkoutsTemplatesPage} name="workoutTemplates" />
          <Route path="/workouts/templates/{id:Int}" page={WorkoutsTemplatePage} name="workoutTemplate" />
          <Route path="/workouts/templates/new" page={WorkoutsNewTemplatePage} name="newWorkoutTemplate" />
          <Route path="/workouts" page={WorkoutsWorkoutsPage} name="workouts" />
          <Route path="/workouts/{id:Int}" page={WorkoutsWorkoutPage} name="workout" />
          <Route path="/workouts/new" page={WorkoutsNewWorkoutPage} name="newWorkout" />
          <Route path="/workouts/exercises" page={WorkoutsExercisesPage} name="exercises" />
        </PrivateSet>
      </Set>

      <Route path="/invoices/{id:String}/preview" page={InvoicesInvoicePreviewPage} name="invoicePreview" />

      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
