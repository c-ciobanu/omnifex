/**
 * @description The series publication status.
 * @example releasing
 * @enum {string}
 */
export type MangaBakaStatus = "cancelled" | "completed" | "hiatus" | "releasing" | "unknown" | "upcoming";

interface MangaBakaSeries {
  /**
   * @description MangaBaka series ID.
   * @example 84926
   */
  id: number;
  /**
   * @description When state is `merged` see the `merged_with` field for the new series ID. You should update your system reference to the new ID to receive future series updates.
   * @enum {string}
   */
  state: "active" | "merged" | "deleted";
  /**
   * @description When series `state` is `merged`, this field represent the new series. Please update your records to this value
   * @example null
   */
  merged_with: number | null;
  /**
   * @description The series primary title, first non-empty value of
   *
   *     - Official English licensed title
   *     - Romanized title
   *     - Native title
   *     - Alternative title
   * @example Re:Zero -Starting Life in Another World-
   */
  title: string;
  /**
   * @description The title for the series in its native (original) language
   * @example Re:ゼロから始める異世界生活
   */
  native_title: string | null;
  /**
   * @description The romanized representation of the native title
   * @example Re:Zero kara Hajimeru Isekai Seikatsu
   */
  romanized_title: string | null;
  /**
   * @example {
   *       "en": [
   *         {
   *           "type": "unofficial",
   *           "title": "Re:Zero -Starting Life in Another World-"
   *         },
   *         {
   *           "type": "unofficial",
   *           "title": "Re:Zero Kara Hajimeru Isekai Seikatsu"
   *         }
   *       ]
   *     }
   */
  secondary_titles: {
    ca?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    cs?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    da?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    de?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    en?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    "es-la"?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    es?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    fi?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    fr?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    he?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    id?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    it?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    "ja-ro"?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    ja?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    kk?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    "ko-ro"?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    ko?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    ms?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    nl?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    pl?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    "pt-br"?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    pt?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    "ru-ro"?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    ru?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    th?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    tl?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    tr?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    uk?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    vi?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    "zh-hk"?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    "zh-ro"?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    zh?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
    unknown?:
      | {
          /** @enum {string} */
          type: "alternative" | "native" | "official" | "unofficial" | "unknown";
          title: string;
          note?: string | null;
        }[]
      | null;
  } | null;
  cover: {
    raw: {
      /** Format: uri */
      url: string | null;
      size?: number | null;
      height?: number | null;
      width?: number | null;
      blurhash?: string | null;
      thumbhash?: string | null;
      format?: string | null;
    };
    /** @description Scaled to retain aspect ratio, with max height of 150px */
    x150: {
      /**
       * Format: uri
       * @description 1x DPI image
       */
      x1: string | null;
      /**
       * Format: uri
       * @description 2x DPI image
       */
      x2: string | null;
      /**
       * Format: uri
       * @description 3x DPI image
       */
      x3: string | null;
    };
    /** @description Scaled to retain aspect ratio, with max height of 250px */
    x250: {
      /**
       * Format: uri
       * @description 1x DPI image
       */
      x1: string | null;
      /**
       * Format: uri
       * @description 2x DPI image
       */
      x2: string | null;
      /**
       * Format: uri
       * @description 3x DPI image
       */
      x3: string | null;
    };
    /** @description Scaled to retain aspect ratio, with max height of 350px */
    x350: {
      /**
       * Format: uri
       * @description 1x DPI image
       */
      x1: string | null;
      /**
       * Format: uri
       * @description 2x DPI image
       */
      x2: string | null;
      /**
       * Format: uri
       * @description 3x DPI image
       */
      x3: string | null;
    };
  };
  /**
   * @description Staff that is credited with being authors on the sites
   * @example [
   *       "NAGATSUKI Tappei"
   *     ]
   */
  authors: string[] | null;
  /**
   * @description Staff that is credited with being artists on the sites
   * @example [
   *       "Shinichirou Ootsuka"
   *     ]
   */
  artists: string[] | null;
  /**
   * @description The series description
   * @example Subaru Natsuki was just trying to get to the convenience store but wound up summoned to another world. He encounters the usual things--life-threatening situations, silver haired beauties, cat fairies--you know, normal stuff. All that would be bad enough, but he's also gained the most inconvenient magical ability of all--time travel, but he's got to die to use it. How do you repay someone who saved your life when all you can do is die?
   */
  description: string | null;
  /**
   * @description The year publication began for the series
   * @example 2014
   */
  year: number | null;
  status: MangaBakaStatus;
  /**
   * @description Has the series been licensed in English?
   * @example true
   */
  is_licensed: boolean;
  /**
   * @description Has the series gotten an anime adaptation?
   * @example true
   */
  has_anime: boolean;
  /** @description Details about the anime adaptation */
  anime: {
    /**
     * @description From what volume/chapter did the anime start at
     * @example Vol 1 (S1)
     */
    start: string | null;
    /**
     * @description At what volume/chapter did the anime stop at
     * @example Vol 9 (S1)
     */
    end: string | null;
  } | null;
  /**
   * @description The sexual content rating of the series - denotes the highest level of sexual content shown.
   *
   *     Generally, "safe" has no nudity or sex, "suggestive" can have nudity but no sex, "erotica" has sex but it's censored, and "pornographic" has uncensored sex or for censored 18+ works.
   * @example safe
   * @enum {string}
   */
  content_rating: "safe" | "suggestive" | "erotica" | "pornographic";
  /**
   * @description The media type for the series.
   * @example novel
   * @enum {string}
   */
  type: "manga" | "novel" | "manhwa" | "manhua" | "oel" | "other";
  /**
   * @description The MangaBaka meta rating, the average of all the source ratings. See `source[*].rating` for individual source ratings
   * @example 8.38275
   */
  rating: number | null;
  /** @example 40 */
  final_volume: string | null;
  /** @example 71 */
  total_chapters: string | null;
  /**
   * @description A raw list of links related to the series. There will always be a link to MangaBaka in this list.
   * @default []
   * @example [
   *       "https://yenpress.com/9780316315302/rezero-starting-life-in-another-world-vol-1-light-novel/",
   *       "https://re-zero.com/",
   *       "https://www.ofelbe.com/Serie-10-ReZero-Revivredansunautremondeàpartirdezéro"
   *     ]
   */
  links: string[] | null;
  /**
   * @description List of publishers for the series
   * @example [
   *       {
   *         "name": "Media Factory",
   *         "type": "Original",
   *         "note": "MF Bunko J"
   *       },
   *       {
   *         "name": "Syosetu",
   *         "type": "Original",
   *         "note": null
   *       },
   *       {
   *         "name": "Yen On",
   *         "type": "English",
   *         "note": "25 Volumes - Ongoing"
   *       }
   *     ]
   */
  publishers:
    | {
        name: string | null;
        type: string | null;
        note: string | null;
      }[]
    | null;
  genres_v2?:
    | {
        id: number;
        parent_id: number | null;
        name: string;
        name_path: string;
        /** @default  */
        description: string | null;
        /** @default false */
        is_spoiler: boolean;
        /**
         * @default safe
         * @enum {string}
         */
        content_rating: "safe" | "suggestive" | "erotica" | "pornographic";
        /** @default 0 */
        series_count: number;
        /** @default 1 */
        level: number;
      }[]
    | null;
  /**
   * @description Series genres
   * @default []
   * @example [
   *       "action",
   *       "adventure",
   *       "drama",
   *       "fantasy",
   *       "psychological"
   *     ]
   */
  genres:
    | (
        | "action"
        | "adult"
        | "adventure"
        | "avant_garde"
        | "award_winning"
        | "boys_love"
        | "comedy"
        | "doujinshi"
        | "drama"
        | "ecchi"
        | "erotica"
        | "fantasy"
        | "gender_bender"
        | "girls_love"
        | "gourmet"
        | "harem"
        | "hentai"
        | "historical"
        | "horror"
        | "josei"
        | "lolicon"
        | "mahou_shoujo"
        | "martial_arts"
        | "mature"
        | "mecha"
        | "music"
        | "mystery"
        | "psychological"
        | "romance"
        | "school_life"
        | "sci-fi"
        | "seinen"
        | "shotacon"
        | "shoujo"
        | "shoujo_ai"
        | "shounen"
        | "shounen_ai"
        | "slice_of_life"
        | "smut"
        | "sports"
        | "supernatural"
        | "suspense"
        | "thriller"
        | "tragedy"
        | "yaoi"
        | "yuri"
      )[]
    | null;
  tags_v2?:
    | {
        id: number;
        parent_id: number | null;
        name: string;
        name_path: string;
        /** @default  */
        description: string | null;
        /** @default false */
        is_spoiler: boolean;
        /**
         * @default safe
         * @enum {string}
         */
        content_rating: "safe" | "suggestive" | "erotica" | "pornographic";
        /** @default 0 */
        series_count: number;
        /** @default 1 */
        level: number;
      }[]
    | null;
  /**
   * @description Freeform list of tags for a series. These values are *NOT* stable and may change at any time.
   * @example [
   *       "Flashbacks",
   *       "Parents",
   *       "Body Horror",
   *       "Kind Male Lead",
   *       "Trap",
   *       "Self-Hatred",
   *       "Dying Protagonist",
   *       "Obsession"
   *     ]
   */
  tags: string[] | null;
  /**
   * Format: date-time
   * @description Most recent timestamp for when ANY source was updated. See `source[*].last_updated_at` (in the full response) for individual source update timestamps
   * @example 2025-06-01T15:07:57.706Z
   */
  last_updated_at: string | null;
  /**
   * @description List of relationships for the series. Each key contains a list of MangaBaka series ID.
   * @example {
   *       "adaptation": [
   *         20299,
   *         21593,
   *         23837,
   *         2634,
   *         3370
   *       ],
   *       "side_story": [
   *         98585,
   *         84927,
   *         32970,
   *         39977
   *       ],
   *       "spin_off": [
   *         26173
   *       ]
   *     }
   */
  relationships: {
    main_story?: number[];
    adaptation?: number[];
    prequel?: number[];
    sequel?: number[];
    side_story?: number[];
    spin_off?: number[];
    alternative?: number[];
    other?: number[];
  } | null;
  /**
   * @description Source specific data
   * @example {
   *       "anilist": {
   *         "id": 85737,
   *         "rating": 8.8
   *       },
   *       "anime_planet": {
   *         "id": null,
   *         "rating": null
   *       },
   *       "anime_news_network": {
   *         "id": 17902,
   *         "rating": null
   *       },
   *       "kitsu": {
   *         "id": 26776,
   *         "rating": 8.261
   *       },
   *       "manga_updates": {
   *         "id": "3qzxncc",
   *         "rating": 7.65
   *       },
   *       "my_anime_list": {
   *         "id": 74697,
   *         "rating": 8.82
   *       },
   *       "shikimori": {
   *         "id": 74697,
   *         "rating": 8.82
   *       }
   *     }
   */
  source: {
    anilist: {
      id: number | null;
      rating: number | null;
      rating_normalized?: number | null;
    };
    anime_planet: {
      id: string | null;
      rating: number | null;
      rating_normalized?: number | null;
    };
    anime_news_network: {
      id: number | null;
      rating: number | null;
      rating_normalized?: number | null;
    };
    kitsu: {
      id: number | null;
      rating: number | null;
      rating_normalized?: number | null;
    };
    manga_updates: {
      id: string | null;
      rating: number | null;
      rating_normalized?: number | null;
    };
    my_anime_list: {
      id: number | null;
      rating: number | null;
      rating_normalized?: number | null;
    };
    shikimori: {
      id: number | null;
      rating: number | null;
      rating_normalized?: number | null;
    };
  };
}

interface GetMangaByMangaUpdatesIdResponse {
  /** @description Included in response when `?with_series=1` is provided. Hidden when `?with_series=0` is set */
  series?: MangaBakaSeries[];
}

const baseUrl = "https://api.mangabaka.dev/v1";

export const getMangaByMangaUpdatesId = async (
  id: string,
): Promise<[undefined, Error] | [MangaBakaSeries | undefined, undefined]> => {
  const response = await fetch(`${baseUrl}/source/manga-updates/${id}`);

  if (response.status !== 200) {
    return [undefined, new Error(response.statusText)];
  }

  const json = (await response.json()) as { data: GetMangaByMangaUpdatesIdResponse };

  return [json.data.series?.[0], undefined];
};
