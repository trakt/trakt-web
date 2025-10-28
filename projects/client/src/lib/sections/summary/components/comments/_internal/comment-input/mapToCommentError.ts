import { CommentError } from '../models/CommentError.ts';

export function mapToCommentError(statusCode: number): CommentError {
  switch (statusCode) {
    case 422:
      return CommentError.InvalidContent;
    default:
      return CommentError.Unknown;
  }
}
