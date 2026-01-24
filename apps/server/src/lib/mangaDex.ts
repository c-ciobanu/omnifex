interface BaseResponse<T> {
  result: string;
  response: string;
  data: T;
}

type PaginatedResponse<T> = BaseResponse<T> & {
  limit: number;
  offset: number;
  total: number;
};

export interface Manga {
  id: string;
  type: "manga";
  attributes: {
    title: {
      "ja-ro"?: string;
      en?: string;
    };
    altTitles: {
      en?: string;
      "ja-ro"?: string;
      "ko-ro"?: string;
      "zh-ro"?: string;
    }[];
    description: {
      en?: string;
    };
    isLocked: boolean;
    links?: {
      al?: string;
      ap?: string;
      bw?: string;
      kt?: string;
      mu?: string;
      amz?: string;
      cdj?: string;
      ebj?: string;
      mal?: string;
      raw?: string;
      engtl?: string;
    };
    officialLinks: null;
    originalLanguage: string;
    lastVolume?: string;
    lastChapter?: string;
    publicationDemographic?: "shounen" | "shoujo" | "josei" | "seinen";
    status: "completed" | "ongoing" | "cancelled" | "hiatus";
    year?: number;
    contentRating: "safe" | "suggestive" | "erotica" | "pornographic";
    tags: {
      id: string;
      type: "tag";
      attributes: {
        name: {
          en: string;
        };
        description: object;
        group: "content" | "format" | "genre" | "theme";
        version: number;
      };
      relationships: [];
    }[];
    state: "draft" | "submitted" | "published" | "rejected";
    chapterNumbersResetOnNewVolume: boolean;
    createdAt: string;
    updatedAt: string;
    version: number;
    availableTranslatedLanguages: string[];
    latestUploadedChapter?: string;
  };
  relationships: Relationship[];
}

interface BaseRelationship {
  id: string;
  related?: string;
}

type Relationship =
  | (BaseRelationship & { type: "author"; attributes: { name: string } })
  | (BaseRelationship & { type: "artist"; attributes: { name: string } })
  | (BaseRelationship & { type: "cover_art"; attributes: { fileName: string } })
  | (BaseRelationship & { type: "manga" });

interface Chapter {
  id: string;
  type: "chapter";
  attributes: {
    title: string | null;
    volume: string | null;
    chapter: string | null;
    pages: number;
    translatedLanguage: string;
    uploader: string;
    externalUrl: string | null;
    version: number;
    createdAt: string;
    updatedAt: string;
    publishAt: string;
    readableAt: string;
    isUnavailable: boolean;
  };
  relationships: Relationship[];
}

const baseUrl = "https://api.mangadex.org";

export const searchMangas = async ({ title }: { title: string }) => {
  const response = await fetch(`${baseUrl}/manga?limit=20&includes[]=cover_art&title=${title}`);

  const json = (await response.json()) as PaginatedResponse<Manga[]>;

  return json.data;
};

export const getManga = async (id: string) => {
  const response = await fetch(`${baseUrl}/manga/${id}?includes[]=author&includes[]=artist&includes[]=cover_art`);

  const json = (await response.json()) as BaseResponse<Manga>;

  return json.data;
};

export const getMangaLatestChapter = async (id: string) => {
  const response = await fetch(`${baseUrl}/chapter?manga=${id}&limit=1&order[chapter]=desc`);

  const json = (await response.json()) as PaginatedResponse<Chapter[]>;

  console.log(json.data[0]?.attributes);

  return json.data[0];
};
