/*
  Warnings:

  - You are about to drop the `BackgroundJob` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RW_DataMigration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."BackgroundJob";

-- DropTable
DROP TABLE "public"."RW_DataMigration";

ALTER TABLE "public"."AbandonedShow" RENAME TO "abandoned-show";
ALTER TABLE "public"."Book" RENAME TO "book";
ALTER TABLE "public"."BookList" RENAME TO "book-list";
ALTER TABLE "public"."BookListItem" RENAME TO "book-list-item";
ALTER TABLE "public"."Document" RENAME TO "document";
ALTER TABLE "public"."File" RENAME TO "file";
ALTER TABLE "public"."Metric" RENAME TO "metric";
ALTER TABLE "public"."MetricEntry" RENAME TO "metric-entry";
ALTER TABLE "public"."Movie" RENAME TO "movie";
ALTER TABLE "public"."MovieList" RENAME TO "movie-list";
ALTER TABLE "public"."MovieListItem" RENAME TO "movie-list-item";
ALTER TABLE "public"."Show" RENAME TO "show";
ALTER TABLE "public"."ShowEpisode" RENAME TO "show-episode";
ALTER TABLE "public"."ShowSeason" RENAME TO "show-season";
ALTER TABLE "public"."WatchedEpisode" RENAME TO "watched-episode";
ALTER TABLE "public"."WatchlistShow" RENAME TO "watchlist-show";

ALTER TABLE "public"."abandoned-show" RENAME CONSTRAINT "AbandonedShow_pkey" TO "abandoned-show_pkey";
ALTER TABLE "public"."book" RENAME CONSTRAINT "Book_pkey" TO "book_pkey";
ALTER TABLE "public"."book-list" RENAME CONSTRAINT "BookList_pkey" TO "book-list_pkey";
ALTER TABLE "public"."book-list-item" RENAME CONSTRAINT "BookListItem_pkey" TO "book-list-item_pkey";
ALTER TABLE "public"."document" RENAME CONSTRAINT "Document_pkey" TO "document_pkey";
ALTER TABLE "public"."file" RENAME CONSTRAINT "File_pkey" TO "file_pkey";
ALTER TABLE "public"."metric" RENAME CONSTRAINT "Metric_pkey" TO "metric_pkey";
ALTER TABLE "public"."metric-entry" RENAME CONSTRAINT "MetricEntry_pkey" TO "metric-entry_pkey";
ALTER TABLE "public"."movie" RENAME CONSTRAINT "Movie_pkey" TO "movie_pkey";
ALTER TABLE "public"."movie-list" RENAME CONSTRAINT "MovieList_pkey" TO "movie-list_pkey";
ALTER TABLE "public"."movie-list-item" RENAME CONSTRAINT "MovieListItem_pkey" TO "movie-list-item_pkey";
ALTER TABLE "public"."show" RENAME CONSTRAINT "Show_pkey" TO "show_pkey";
ALTER TABLE "public"."show-episode" RENAME CONSTRAINT "ShowEpisode_pkey" TO "show-episode_pkey";
ALTER TABLE "public"."show-season" RENAME CONSTRAINT "ShowSeason_pkey" TO "show-season_pkey";
ALTER TABLE "public"."watched-episode" RENAME CONSTRAINT "WatchedEpisode_pkey" TO "watched-episode_pkey";
ALTER TABLE "public"."watchlist-show" RENAME CONSTRAINT "WatchlistShow_pkey" TO "watchlist-show_pkey";

ALTER TABLE "public"."abandoned-show" RENAME CONSTRAINT "AbandonedShow_showId_fkey" TO "abandoned-show_showId_fkey";
ALTER TABLE "public"."abandoned-show" RENAME CONSTRAINT "AbandonedShow_userId_fkey" TO "abandoned-show_userId_fkey";
ALTER TABLE "public"."book-list" RENAME CONSTRAINT "BookList_userId_fkey" TO "book-list_userId_fkey";
ALTER TABLE "public"."book-list-item" RENAME CONSTRAINT "BookListItem_bookId_fkey" TO "book-list-item_bookId_fkey";
ALTER TABLE "public"."book-list-item" RENAME CONSTRAINT "BookListItem_listId_fkey" TO "book-list-item_listId_fkey";
ALTER TABLE "public"."document" RENAME CONSTRAINT "Document_userId_fkey" TO "document_userId_fkey";
ALTER TABLE "public"."file" RENAME CONSTRAINT "File_userId_fkey" TO "file_userId_fkey";
ALTER TABLE "public"."metric" RENAME CONSTRAINT "Metric_userId_fkey" TO "metric_userId_fkey";
ALTER TABLE "public"."metric-entry" RENAME CONSTRAINT "MetricEntry_metricId_fkey" TO "metric-entry_metricId_fkey";
ALTER TABLE "public"."movie-list" RENAME CONSTRAINT "MovieList_userId_fkey" TO "movie-list_userId_fkey";
ALTER TABLE "public"."movie-list-item" RENAME CONSTRAINT "MovieListItem_listId_fkey" TO "movie-list-item_listId_fkey";
ALTER TABLE "public"."movie-list-item" RENAME CONSTRAINT "MovieListItem_movieId_fkey" TO "movie-list-item_movieId_fkey";
ALTER TABLE "public"."show-episode" RENAME CONSTRAINT "ShowEpisode_seasonId_fkey" TO "show-episode_seasonId_fkey";
ALTER TABLE "public"."show-episode" RENAME CONSTRAINT "ShowEpisode_showId_fkey" TO "show-episode_showId_fkey";
ALTER TABLE "public"."show-season" RENAME CONSTRAINT "ShowSeason_showId_fkey" TO "show-season_showId_fkey";
ALTER TABLE "public"."watched-episode" RENAME CONSTRAINT "WatchedEpisode_episodeId_fkey" TO "watched-episode_episodeId_fkey";
ALTER TABLE "public"."watched-episode" RENAME CONSTRAINT "WatchedEpisode_seasonId_fkey" TO "watched-episode_seasonId_fkey";
ALTER TABLE "public"."watched-episode" RENAME CONSTRAINT "WatchedEpisode_showId_fkey" TO "watched-episode_showId_fkey";
ALTER TABLE "public"."watched-episode" RENAME CONSTRAINT "WatchedEpisode_userId_fkey" TO "watched-episode_userId_fkey";
ALTER TABLE "public"."watchlist-show" RENAME CONSTRAINT "WatchlistShow_showId_fkey" TO "watchlist-show_showId_fkey";
ALTER TABLE "public"."watchlist-show" RENAME CONSTRAINT "WatchlistShow_userId_fkey" TO "watchlist-show_userId_fkey";

ALTER INDEX "public"."Book_googleId_key" RENAME TO "book_googleId_key";
ALTER INDEX "public"."BookList_userId_name_key" RENAME TO "book-list_userId_name_key";
ALTER INDEX "public"."BookListItem_listId_bookId_key" RENAME TO "book-list-item_listId_bookId_key";
ALTER INDEX "public"."Document_userId_title_key" RENAME TO "document_userId_title_key";
ALTER INDEX "public"."File_key_key" RENAME TO "file_key_key";
ALTER INDEX "public"."File_userId_name_key" RENAME TO "file_userId_name_key";
ALTER INDEX "public"."Metric_userId_name_key" RENAME TO "metric_userId_name_key";
ALTER INDEX "public"."MetricEntry_metricId_date_key" RENAME TO "metric-entry_metricId_date_key";
ALTER INDEX "public"."Movie_imdbId_key" RENAME TO "movie_imdbId_key";
ALTER INDEX "public"."Movie_tmdbId_key" RENAME TO "movie_tmdbId_key";
ALTER INDEX "public"."MovieList_userId_name_key" RENAME TO "movie-list_userId_name_key";
ALTER INDEX "public"."MovieListItem_listId_movieId_key" RENAME TO "movie-list-item_listId_movieId_key";
ALTER INDEX "public"."Show_imdbId_key" RENAME TO "show_imdbId_key";
ALTER INDEX "public"."Show_tmdbId_key" RENAME TO "show_tmdbId_key";
ALTER INDEX "public"."ShowSeason_showId_number_key" RENAME TO "show-season_showId_number_key";
ALTER INDEX "public"."ShowEpisode_seasonId_number_key" RENAME TO "show-episode_seasonId_number_key";
ALTER INDEX "public"."WatchlistShow_userId_showId_key" RENAME TO "watchlist-show_userId_showId_key";
ALTER INDEX "public"."AbandonedShow_userId_showId_key" RENAME TO "abandoned-show_userId_showId_key";
ALTER INDEX "public"."WatchedEpisode_userId_episodeId_key" RENAME TO "watched-episode_userId_episodeId_key";
