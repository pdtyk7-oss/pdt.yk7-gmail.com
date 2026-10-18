"""An original glossy gold "No. 1" medal, drawn as vector: scalloped seal, laurel wreath, numeral, ribbons and glass highlights."""
import math

def _scallop(r, bumps=18, amp=1.7, n=360):
    pts = []
    for i in range(n):
        a = 2 * math.pi * i / n
        rr = r + amp * math.sin(bumps * a)
        pts.append(f'{rr*math.cos(a):.2f} {rr*math.sin(a):.2f}')
    return 'M' + 'L'.join(pts) + 'Z'

def _leaf(cx, cy, rot, rx=4.3, ry=1.9):
    return f'<ellipse cx="{cx:.2f}" cy="{cy:.2f}" rx="{rx}" ry="{ry}" transform="rotate({rot:.1f} {cx:.2f} {cy:.2f})"/>'

def _wreath(r=19.5):
    """Two laurel branches that start at the bottom of the disc and rise on both sides."""
    leaves = []
    for side in (-1, 1):
        for phi in range(10, 132, 13):                    # degrees from the bottom of the circle
            a = math.radians(phi)
            leaves.append(_leaf(side * r * math.sin(a), r * math.cos(a), side * (40 - phi)))
    return ''.join(leaves)

def _star(cx, cy, r):
    pts = []
    for i in range(10):
        rr = r if i % 2 == 0 else r * 0.45
        a = -math.pi / 2 + i * math.pi / 5
        pts.append(f'{cx + rr*math.cos(a):.2f} {cy + rr*math.sin(a):.2f}')
    return 'M' + 'L'.join(pts) + 'Z'

def medal(uid='md'):
    """Returns (defs, body) in a local coordinate system centred on the medal, radius about 32."""
    defs = f'''
<linearGradient id="{uid}-rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF3BF"/><stop offset=".35" stop-color="#F3C34F"/><stop offset=".72" stop-color="#C98F22"/><stop offset="1" stop-color="#8E5E10"/></linearGradient>
<radialGradient id="{uid}-face" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="#FFEBA6"/><stop offset=".5" stop-color="#F1BD45"/><stop offset="1" stop-color="#C58A1E"/></radialGradient>
<linearGradient id="{uid}-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF8D6"/><stop offset="1" stop-color="#A56F0E"/></linearGradient>
<linearGradient id="{uid}-ribbon" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2E3A68"/><stop offset=".5" stop-color="#1A2547"/><stop offset="1" stop-color="#0F1731"/></linearGradient>
<linearGradient id="{uid}-gloss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".55" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="{uid}-streak" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="{uid}-shade" cx=".5" cy=".5" r=".5"><stop offset=".6" stop-color="#5A3A00" stop-opacity="0"/><stop offset="1" stop-color="#5A3A00" stop-opacity=".35"/></radialGradient>
<radialGradient id="{uid}-shadow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#1A2547" stop-opacity=".28"/><stop offset="1" stop-color="#1A2547" stop-opacity="0"/></radialGradient>
<clipPath id="{uid}-disc"><circle r="25"/></clipPath>'''
    body = f'''
<ellipse cx="0" cy="50" rx="24" ry="4.5" fill="url(#{uid}-shadow)"/>
<g>
  <path d="M-16 20 L-27 56 L-17 51 L-12 61 L-3 24 Z" fill="url(#{uid}-ribbon)"/>
  <path d="M16 20 L27 56 L17 51 L12 61 L3 24 Z" fill="url(#{uid}-ribbon)"/>
  <path d="M-16 20 L-24 46 L-21 46 L-12 22 Z" fill="#fff" opacity=".16"/>
  <path d="M16 20 L24 46 L21 46 L12 22 Z" fill="#fff" opacity=".1"/>
</g>
<path d="{_scallop(33)}" fill="url(#{uid}-rim)"/>
<circle r="29" fill="none" stroke="url(#{uid}-ring)" stroke-width="1.3"/>
<circle r="25.5" fill="url(#{uid}-face)"/>
<circle r="25.5" fill="url(#{uid}-shade)"/>
<circle r="25.5" fill="none" stroke="#FFF6D0" stroke-opacity=".9" stroke-width=".9"/>
<g fill="#1A2547">{_wreath()}</g>
<g fill="#1A2547"><path d="{_star(-8.5,-16.6,2.5)}"/><path d="{_star(0,-19.3,2.9)}"/><path d="{_star(8.5,-16.6,2.5)}"/></g>
<path d="M-7.6 -1.6 L0.2 -10.2 H5 V8 H9.6 V11.6 H-9.6 V8 H-4.6 V-2.4 L-7 -1 Z" fill="#1A2547"/>
<g clip-path="url(#{uid}-disc)">
  <ellipse cx="-3" cy="-13" rx="23" ry="15" fill="url(#{uid}-gloss)"/>
  <path d="M-25 8 L-6 -26 L3 -26 L-18 14 Z" fill="url(#{uid}-streak)" opacity=".7"/>
</g>
<path d="M-24 -9 A25.5 25.5 0 0 1 -9 -23.5" fill="none" stroke="#fff" stroke-opacity=".95" stroke-width="1.6" stroke-linecap="round"/>
<ellipse cx="-14.5" cy="-18" rx="2.6" ry="1.3" fill="#fff" transform="rotate(-38 -14.5 -18)"/>'''
    return defs, body
