import {BaseRepository} from './_base';
import Language from '../models/language';

export class LanguageRepository extends BaseRepository<Language> {
  constructor() {
    super(Language);
  }
}

export default LanguageRepository;
