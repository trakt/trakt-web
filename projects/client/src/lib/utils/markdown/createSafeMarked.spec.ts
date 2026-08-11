import { createHeadingRenderer } from '$lib/sections/summary/components/comments/_internal/marked/createHeadingRenderer.ts';
import { createParagraphRenderer } from '$lib/sections/summary/components/comments/_internal/marked/createParagraphRenderer.ts';
import { spoilerExtension } from '$lib/sections/summary/components/comments/_internal/marked/spoilerExtension.ts';
import { describe, expect, it } from 'vitest';
import { createSafeMarked } from './createSafeMarked.ts';

const commentOptions = { gfm: true, breaks: true, async: false } as const;

const DANGEROUS_ELEMENTS =
  'script, img, iframe, svg, style, object, embed, link, base, form';

const renderComment = (source: string) =>
  createSafeMarked().parse(source, commentOptions);

const toDom = (html: string) => {
  const container = document.createElement('div');
  container.innerHTML = html;
  return container;
};

const eventHandlerAttributesOf = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('*'))
    .flatMap((element) => Array.from(element.attributes))
    .map((attribute) => attribute.name)
    .filter((name) => name.startsWith('on'));

describe('createSafeMarked', () => {
  describe('raw html', () => {
    const payloads = [
      '<img src=x onerror=alert(1)>',
      '<script>alert(1)</script>',
      '<div onmouseover="alert(1)">hover</div>',
      '<svg/onload=alert(1)>',
      '<iframe src="javascript:alert(1)"></iframe>',
      '<a href="javascript:alert(1)">click</a>',
      '<style>body{display:none}</style>',
      '<object data="javascript:alert(1)"></object>',
      '<base href="https://evil.example/">',
    ];

    payloads.forEach((payload) => {
      it(
        `should build no dangerous element for ${JSON.stringify(payload)}`,
        () => {
          const container = toDom(renderComment(payload));

          expect(container.querySelector(DANGEROUS_ELEMENTS)).toBeNull();
        },
      );

      it(`should build no event handler for ${JSON.stringify(payload)}`, () => {
        const container = toDom(renderComment(payload));

        expect(eventHandlerAttributesOf(container)).toEqual([]);
      });
    });

    it('should keep raw html readable as text', () => {
      expect(renderComment('<img src=x onerror=alert(1)>')).toContain(
        '&lt;img src=x onerror=alert(1)&gt;',
      );
    });

    it('should not lose the content of a block level tag', () => {
      expect(toDom(renderComment('<div>my entire review</div>')).textContent)
        .toContain('my entire review');
    });

    it('should not leave a raw html comment in the output', () => {
      expect(renderComment('<!-- <img src=x onerror=alert(1)> -->'))
        .not.toContain('<!--');
    });
  });

  describe('unsafe link protocols', () => {
    const payloads = [
      '[click](javascript:alert(1))',
      '[click](JaVaScRiPt:alert(1))',
      '[click](&#106;avascript:alert(1))',
      '[click](javascript&colon;alert(1))',
      '[click](javascript&#58;alert(1))',
      '[click](javascript&#x3a;alert(1))',
      '[click](data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==)',
      '[click](vbscript:msgbox(1))',
    ];

    payloads.forEach((payload) => {
      it(`should build no anchor for ${JSON.stringify(payload)}`, () => {
        const container = toDom(renderComment(payload));

        expect(container.querySelector('a')).toBeNull();
        expect(container.textContent).toContain('click');
      });

      it(
        `should resolve no unsafe protocol for ${JSON.stringify(payload)}`,
        () => {
          const container = toDom(renderComment(payload));
          const anchors = Array.from(container.querySelectorAll('a'));

          expect(anchors.map((anchor) => anchor.protocol)).toEqual([]);
        },
      );
    });

    it('should build no image for an unsafe source', () => {
      const container = toDom(
        renderComment('![alt text](javascript:alert(1))'),
      );

      expect(container.querySelector('img')).toBeNull();
      expect(container.textContent).toContain('alt text');
    });

    it('should build no image for an entity encoded source', () => {
      const container = toDom(
        renderComment('![alt text](javascript&colon;alert(1))'),
      );

      expect(container.querySelector('img')).toBeNull();
      expect(container.textContent).toContain('alt text');
    });
  });

  describe('attribute encoding', () => {
    it('should escape an ampersand in a href', () => {
      expect(renderComment('[ok](/movies?a=1&b=2)')).toContain(
        'href="/movies?a=1&amp;b=2"',
      );
    });

    it('should resolve a href to the value that was validated', () => {
      const source = '/movies?a=1&b=2';
      const anchor = toDom(renderComment(`[ok](${source})`)).querySelector('a');

      expect(anchor).toHaveAttribute('href', source);
    });

    it('should escape an ampersand in an image source', () => {
      const image = toDom(renderComment('![alt](/i.png?a=1&b=2)'))
        .querySelector('img');

      expect(image).toHaveAttribute('src', '/i.png?a=1&b=2');
    });

    it('should escape a link title', () => {
      const anchor = toDom(renderComment('[ok](/a "b&c")')).querySelector('a');

      expect(anchor).toHaveAttribute('title', 'b&c');
    });

    it('should escape an image alt text', () => {
      const image = toDom(renderComment('![a&b](/i.png)')).querySelector('img');

      expect(image).toHaveAttribute('alt', 'a&b');
    });

    it('should build no title attribute when there is none', () => {
      const anchor = toDom(renderComment('[ok](/a)')).querySelector('a');

      expect(anchor).not.toHaveAttribute('title');
    });
  });

  describe('safe markdown', () => {
    it('should render bold text', () => {
      expect(renderComment('**bold**')).toContain('<strong>bold</strong>');
    });

    it('should render emphasis', () => {
      expect(renderComment('*em*')).toContain('<em>em</em>');
    });

    it('should render an https link', () => {
      expect(toDom(renderComment('[ok](https://trakt.tv)')).querySelector('a'))
        .toHaveAttribute('href', 'https://trakt.tv');
    });

    it('should render a relative link', () => {
      expect(
        toDom(renderComment('[ok](/movies/heretic-2024)')).querySelector('a'),
      ).toHaveAttribute('href', '/movies/heretic-2024');
    });

    it('should render a fragment link', () => {
      expect(toDom(renderComment('[ok](#section)')).querySelector('a'))
        .toHaveAttribute('href', '#section');
    });

    it('should render a mailto link', () => {
      expect(
        toDom(renderComment('[ok](mailto:support@trakt.tv)')).querySelector(
          'a',
        ),
      ).toHaveAttribute('href', 'mailto:support@trakt.tv');
    });

    it('should render an autolink', () => {
      expect(toDom(renderComment('<https://trakt.tv>')).querySelector('a'))
        .toHaveAttribute('href', 'https://trakt.tv');
    });

    it('should preserve query parameters', () => {
      expect(
        toDom(renderComment('[ok](https://trakt.tv/a?b=1&c=2)')).querySelector(
          'a',
        ),
      ).toHaveAttribute('href', 'https://trakt.tv/a?b=1&c=2');
    });

    it('should render a codespan containing a tag', () => {
      expect(renderComment('`<script>`')).toContain(
        '<code>&lt;script&gt;</code>',
      );
    });

    it('should render a fenced code block', () => {
      expect(renderComment('```\nconst a = 1;\n```')).toContain('<pre>');
    });

    it('should render a list', () => {
      expect(renderComment('- one\n- two')).toContain('<li>');
    });

    it('should render a blockquote', () => {
      expect(renderComment('> quoted')).toContain('<blockquote>');
    });
  });

  describe('composed with the comment renderers', () => {
    const renderWithCommentExtensions = (
      source: string,
      isCommentSpoiler = false,
    ) =>
      createSafeMarked({
        extensions: [spoilerExtension()],
        renderer: {
          paragraph: createParagraphRenderer(isCommentSpoiler),
          heading: createHeadingRenderer(),
        },
      }).parse(source, commentOptions);

    it('should neutralise a payload inside a spoiler tag', () => {
      const container = toDom(
        renderWithCommentExtensions(
          '[spoiler]<img src=x onerror=alert(1)>[/spoiler]',
        ),
      );

      expect(container.querySelector(DANGEROUS_ELEMENTS)).toBeNull();
      expect(eventHandlerAttributesOf(container)).toEqual([]);
    });

    it('should still render a spoiler tag', () => {
      const result = renderWithCommentExtensions('[spoiler]hidden[/spoiler]');

      expect(result).toContain('class="trakt-spoiler"');
      expect(result).toContain('<span>hidden</span>');
    });

    it('should still render a heading', () => {
      expect(renderWithCommentExtensions('# title')).toContain(
        'class="bold trakt-comment-heading"',
      );
    });

    it('should neutralise a payload inside a heading', () => {
      const container = toDom(
        renderWithCommentExtensions('# <img src=x onerror=alert(1)>'),
      );

      expect(container.querySelector(DANGEROUS_ELEMENTS)).toBeNull();
      expect(eventHandlerAttributesOf(container)).toEqual([]);
    });
  });
});
