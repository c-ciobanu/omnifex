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
          <Route path="/login" page={LoginPage} name="login" />
          <Route path="/signup" page={SignupPage} name="signup" />
          {/* <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" /> */}
          {/* <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" /> */}

          <Route path="/" page={HomePage} name="home" />
        </Set>

        <Route path="/search/movies" page={SearchMoviesPage} name="searchMovies" />
        <Route path="/search/shows" page={SearchShowsPage} name="searchShows" />
        <Route path="/search/books" page={SearchBooksPage} name="searchBooks" />
        <Route path="/movies/{tmdbId:Int}" page={MoviePage} name="movie" />
        <Route path="/books/{googleId:String}" page={BookPage} name="book" />
        <Route path="/documents/{id:String}" page={DocumentPage} name="document" />
        <Route path="/tools/pomodoro" page={PomodoroTimerPage} name="pomodoro" />
        <Route path="/invoices" page={InvoicesInvoicesPage} name="invoices" />
        <Route path="/invoices/new" page={InvoicesNewInvoicePage} name="newInvoice" />

        <PrivateSet unauthenticated="home">
          <Route path="/movies" page={MoviesPage} name="movies" />
          <Route path="/books" page={BooksPage} name="books" />
          <Route path="/documents" page={DocumentsPage} name="documents" />
          <Route path="/metrics" page={MetricsMetricsPage} name="metrics" />
          <Route path="/metrics/{id:Int}" page={MetricsMetricPage} name="metric" />
          <Route path="/workouts" page={WorkoutsWorkoutsPage} name="workouts" />
          <Route path="/workouts/{id:Int}" page={WorkoutsWorkoutPage} name="workout" />
          <Route path="/workouts/new" page={WorkoutsNewWorkoutPage} name="newWorkout" />
        </PrivateSet>
      </Set>

      <Route path="/invoices/{id:String}/preview" page={InvoicesInvoicePreviewPage} name="invoicePreview" />

      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
