interface SearchMangasResponse {
  /** total_hits */
  total_hits?: number;
  /** page */
  page?: number;
  /** per_page */
  per_page?: number;
  /** results */
  results?: {
    record?: {
      /** series_id */
      series_id?: number;
      /** title */
      title?: string;
      /** url */
      url?: string;
      /** description */
      description?: string;
      image?: {
        /** ImageModelV1Url */
        url?: {
          /** original */
          original?: string;
          /** thumb */
          thumb?: string;
        };
        /** height */
        height?: number;
        /** width */
        width?: number;
      };
      /**
       * type
       * @enum {string}
       */
      type?:
        | "Artbook"
        | "Doujinshi"
        | "Drama CD"
        | "Filipino"
        | "Indonesian"
        | "Manga"
        | "Manhwa"
        | "Manhua"
        | "Novel"
        | "OEL"
        | "Thai"
        | "Vietnamese"
        | "Malaysian"
        | "Nordic"
        | "French"
        | "Spanish"
        | "German";
      /** year */
      year?: string;
      /** bayesian_rating */
      bayesian_rating?: number;
      /** rating_votes */
      rating_votes?: number;
      /** genres */
      genres?: {
        /** genre */
        genre?: string;
      }[];
      /** latest_chapter */
      latest_chapter?: number;
      /** SeriesModelSearchV1Rank */
      rank?: {
        /** SeriesModelSearchV1RankPosition */
        position?: {
          /** week */
          week?: number;
          /** month */
          month?: number;
          /** three_months */
          three_months?: number;
          /** six_months */
          six_months?: number;
          /** year */
          year?: number;
        };
        /** SeriesModelSearchV1RankOldPosition */
        old_position?: {
          /** week */
          week?: number;
          /** month */
          month?: number;
          /** three_months */
          three_months?: number;
          /** six_months */
          six_months?: number;
          /** year */
          year?: number;
        };
        /** SeriesModelSearchV1RankLists */
        lists?: {
          /** reading */
          reading?: number;
          /** wish */
          wish?: number;
          /** complete */
          complete?: number;
          /** unfinished */
          unfinished?: number;
          /** custom */
          custom?: number;
        };
      };
      last_updated?: {
        /** timestamp */
        timestamp?: number;
        /**
         * as_rfc3339
         * Format: date-time
         */
        as_rfc3339?: string;
        /** as_string */
        as_string?: string;
      };
    };
    /** hit_title */
    hit_title?: string;
  }[];
}

const baseUrl = "https://api.mangaupdates.com/v1";

export const searchMangas = async (title: string) => {
  const response = await fetch(`${baseUrl}/series/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ search: title, orderby: "score" }),
  });

  const json = (await response.json()) as SearchMangasResponse;

  return json.results?.map((e) => e.record).filter((e) => e !== undefined) ?? [];
};
