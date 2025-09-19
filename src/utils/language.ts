import {ConfigDefault} from './enums';
import {IConfig} from './types';

function getContentLanguage(text: string, start: string, end: string): string | null {
  const pos = text.indexOf(start);

  if (pos === -1) {
    return null;
  }

  const startPos = pos + start.length;
  const endPos = text.indexOf(end, startPos);

  if (endPos === -1) {
    return null;
  }

  const contentLength = endPos - startPos;
  return text.substr(startPos, contentLength);
}

export const getTranslate = (text: string, lang: string = 'en', format: boolean = false): string => {
  if (!text || text === '') {
    return '';
  }

  let textOrigin = text;
  if (text.includes('[:]')) {
    const startLang = '[:' + lang.trim() + ']';
    const endLang = '[:';

    text = getContentLanguage(text, startLang, endLang);
    if (!text) {
      const startLangRetry = '[:' + lang.trim() + ']';
      text = getContentLanguage(textOrigin, startLangRetry, endLang);

      if (text === '' && lang === 'en') {
        return '';
      }

      if (!text) {
        return getTranslate(textOrigin);
      }
    }
  } else if (text.includes('{"')) {
    const content = JSON.parse(text);
    text = content[lang];
  }

  return text;
};

export const checkTranslate = (text: string, lang: string = 'en'): string => {
  let result = null;
  if (text.includes('[:]')) {
    const startLang = '[:' + lang.trim() + ']';
    const endLang = '[:';
    result = getContentLanguage(text, startLang, endLang);
  }

  return result;
};

// export const setTranslate = async (data: string): Promise<string> => {
//   let text = removeExtraSpaces(data);
//   let result = '';
//   const langs = await new LanguageService().getAllOrLimit({} as IConfig, null);
//   if (langs && langs.length > 0) {
//     for (let lang of langs) {
//       const translate = await callHTMLTranslator(text, lang.code);
//       result += `[:${lang.code}]${translate}`;
//     }
//     result += '[:]';
//   }

//   return result;
// };

// export const setTranslateHTML = async (text: string, lang: string): Promise<string> => {
//   const translate = await callHTMLTranslator(text, lang);
//   return translate;
// };

export const translateModel = (data: any, translation: any) => {
  if (translation && data) {
    const language = translation.language;
    const fields = translation.fields || [];
    if (Array.isArray(data)) {
      data.forEach((result) => {
        // result = result?.get({ plain: true });
        for (let field of fields) {
          if (!result['dataValues'] && (!result[field] || result[field] == undefined)) {
            continue;
          } else if (result[field]) {
            let content = getTranslate(result[field], language);
            if (!content && language != ConfigDefault.language) {
              content = getTranslate(result[field]);
            }
            result[field] = content;
          } else if (result['dataValues'] && result['dataValues'][field]) {
            let content = getTranslate(result['dataValues'][field], language);
            if (!content && language != ConfigDefault.language) {
              content = getTranslate(result['dataValues'][field]);
            }
            result['dataValues'][field] = content;
          }
        }
      });
    } else {
      for (let field of fields) {
        if (!data['dataValues'] && (!data[field] || data[field] == undefined)) {
          continue;
        } else if (data[field]) {
          let content = getTranslate(data[field], language);
          if (!content && language != ConfigDefault.language) {
            content = getTranslate(data[field]);
          }
          data[field] = content;
        } else if (data['dataValues'] && data['dataValues'][field]) {
          let content = getTranslate(data['dataValues'][field], language);
          if (!content && language != ConfigDefault.language) {
            content = getTranslate(data['dataValues'][field]);
          }
          data['dataValues'][field] = content;
        }
      }
    }
  }
};

export const removeExtraSpaces = (input: string): string => {
  if (!input) {
    return null;
  }

  return input
    .replace(/[^\S\r\n]+/g, ' ')
    .replace(/[\r\n]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const capitalizeWords = (input: string): string => {
  if (!input) {
    return null;
  }

  return input
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const convertToLowercase = (inputString) => {
  // Split the string into lines
  const lines = inputString.split('\n');

  // Iterate over each line
  const transformedLines = lines.map((line) => {
    let transformedLine = '';

    // Flag to track the position of the period
    let afterPeriod = true;

    // Iterate over each character in the line
    for (let i = 0; i < line.length; i++) {
      const currentChar = line.charAt(i);

      // If the character is a period, set the afterPeriod flag to true
      if (currentChar === '.') {
        afterPeriod = true;
        transformedLine += currentChar;
      } else {
        // If it's an alphabetical character and after a period, capitalize it
        transformedLine += afterPeriod ? currentChar.toUpperCase() : currentChar.toLowerCase();
        afterPeriod = false;
      }
    }

    return transformedLine;
  });

  // Join the transformed lines back into a string, preserving line breaks
  const result = transformedLines.join('\n');

  return result;
};

export const removeLargeNumbers = (text: string): string => {
  // Biểu thức chính quy để tìm các chuỗi số có 5 ký tự trở lên
  const pattern = /\b\d{5,}\b/g;
  // Thay thế các chuỗi số phù hợp với biểu thức chính quy bằng chuỗi rỗng
  const result = text.replace(pattern, '').replace(/\s\s+/g, ' ').trim();
  return result;
};
