#!/usr/bin/env python3
"""Check local Markdown links and keep generated verification output out of planning."""

from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import unquote, urlsplit


def main():
    files = subprocess.check_output(
        ['git', 'ls-files', '-z', '--cached', '--others', '--exclude-standard']
    ).decode().split('\0')
    errors = []
    output_extensions = {'.log', '.jsonl', '.har', '.trace'}
    capture_extensions = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.mp4', '.webm', '.zip'}

    for name in sorted(set(files)):
        file = Path(name)
        if not name or not file.is_file():
            continue

        if name.startswith('planning/'):
            generated = file.suffix in output_extensions
            generated |= any(part in {'test-results', 'playwright-report'} for part in file.parts)
            if not name.startswith('planning/design/'):
                generated |= file.suffix in capture_extensions
            if name.startswith('planning/development/evidence/'):
                generated |= file.suffix != '.md'
            if generated:
                errors.append(f'{name}: move generated output to CI artifacts or a temporary directory')

        if file.suffix != '.md':
            continue

        source = re.sub(
            r'```[^\n]*\n.*?```',
            lambda match: '\n' * match[0].count('\n'),
            file.read_text(),
            flags=re.S
        )
        for match in re.finditer(r'\]\(([^)\n]+)\)', source):
            target = match[1].strip().split(' "')[0].strip('<>')
            url = urlsplit(target)
            if url.scheme or url.netloc or not url.path:
                continue
            destination = file.parent / unquote(url.path)
            if not destination.exists():
                line = source.count('\n', 0, match.start()) + 1
                errors.append(f'{name}:{line}: missing link target {target}')

    if errors:
        print('\n'.join(errors), file=sys.stderr)
        return 1

    print('PASS: local Markdown file links and planning output policy')
    return 0


if __name__ == '__main__':
    sys.exit(main())
