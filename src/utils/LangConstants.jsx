const LangConstants = {
  en: {
    search: "Search",
    GptSearchPlaceHolder: "Whats On Your Mind ?",
  },
  hindi: {
    search: "खोज",
    GptSearchPlaceHolder: "आपके दिमाग में क्या है ?",
  },
  spanish: {
    search: "buscar",
    GptSearchPlaceHolder: "Qué tienes en mente ?",
  },
};
export default LangConstants;

export const SUPPORTED_LANGUAGES = [
  { identifier: "en", name: "English" },
  { identifier: "hindi", name: "Hindi" },
  { identifier: "spanish", name: "Spanish" },
];
