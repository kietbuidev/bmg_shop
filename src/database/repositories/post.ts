import {BaseRepository} from './_base';
import Post from '../models/post';

export class PostRepository extends BaseRepository<Post> {
  constructor() {
    super(Post);
  }
}

export default PostRepository;
