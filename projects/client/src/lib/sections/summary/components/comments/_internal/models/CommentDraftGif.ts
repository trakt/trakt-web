export type CommentDraftGif = {
  // The Klipy link that goes into the comment text on submit. The server lifts
  // it back out onto the comment's own `gif` field.
  url: string;
  // What the composer shows. A gif that came back from the server is its own
  // preview; a freshly picked one has a lighter variant to show instead.
  previewUrl: string;
};
