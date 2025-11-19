import { describe, expect, it } from 'vitest';
import { toCountryFlag } from './toCountryFlag.ts';

describe('toCountryFlag', () => {
  it('should convert US to 🇺🇸', () => {
    expect(toCountryFlag('US')).toBe('🇺🇸');
  });

  it('should convert gb to 🇬🇧', () => {
    expect(toCountryFlag('gb')).toBe('🇬🇧');
  });

  it('should convert de to 🇩🇪', () => {
    expect(toCountryFlag('de')).toBe('🇩🇪');
  });

  it('should handle lowercase input', () => {
    expect(toCountryFlag('fr')).toBe('🇫🇷');
  });

  it('should handle mixed case input', () => {
    expect(toCountryFlag('jP')).toBe('🇯🇵');
  });

  it('should convert ad to 🇦🇩', () => {
    expect(toCountryFlag('ad')).toBe('🇦🇩');
  });

  it('should convert ag to 🇦🇬', () => {
    expect(toCountryFlag('ag')).toBe('🇦🇬');
  });

  it('should convert ar to 🇦🇷', () => {
    expect(toCountryFlag('ar')).toBe('🇦🇷');
  });

  it('should convert at to 🇦🇹', () => {
    expect(toCountryFlag('at')).toBe('🇦🇹');
  });

  it('should convert au to 🇦🇺', () => {
    expect(toCountryFlag('au')).toBe('🇦🇺');
  });

  it('should convert ba to 🇧🇦', () => {
    expect(toCountryFlag('ba')).toBe('🇧🇦');
  });

  it('should convert bb to 🇧🇧', () => {
    expect(toCountryFlag('bb')).toBe('🇧🇧');
  });

  it('should convert be to 🇧🇪', () => {
    expect(toCountryFlag('be')).toBe('🇧🇪');
  });

  it('should convert bg to 🇧🇬', () => {
    expect(toCountryFlag('bg')).toBe('🇧🇬');
  });

  it('should convert bo to 🇧🇴', () => {
    expect(toCountryFlag('bo')).toBe('🇧🇴');
  });

  it('should convert br to 🇧🇷', () => {
    expect(toCountryFlag('br')).toBe('🇧🇷');
  });

  it('should convert bs to 🇧🇸', () => {
    expect(toCountryFlag('bs')).toBe('🇧🇸');
  });

  it('should convert bz to 🇧🇿', () => {
    expect(toCountryFlag('bz')).toBe('🇧🇿');
  });

  it('should convert ca to 🇨🇦', () => {
    expect(toCountryFlag('ca')).toBe('🇨🇦');
  });

  it('should convert ch to 🇨🇭', () => {
    expect(toCountryFlag('ch')).toBe('🇨🇭');
  });

  it('should convert cl to 🇨🇱', () => {
    expect(toCountryFlag('cl')).toBe('🇨🇱');
  });

  it('should convert co to 🇨🇴', () => {
    expect(toCountryFlag('co')).toBe('🇨🇴');
  });

  it('should convert cr to 🇨🇷', () => {
    expect(toCountryFlag('cr')).toBe('🇨🇷');
  });

  it('should convert cv to 🇨🇻', () => {
    expect(toCountryFlag('cv')).toBe('🇨🇻');
  });

  it('should convert cz to 🇨🇿', () => {
    expect(toCountryFlag('cz')).toBe('🇨🇿');
  });

  it('should convert dk to 🇩🇰', () => {
    expect(toCountryFlag('dk')).toBe('🇩🇰');
  });

  it('should convert do to 🇩🇴', () => {
    expect(toCountryFlag('do')).toBe('🇩🇴');
  });

  it('should convert ec to 🇪🇨', () => {
    expect(toCountryFlag('ec')).toBe('🇪🇨');
  });

  it('should convert ee to 🇪🇪', () => {
    expect(toCountryFlag('ee')).toBe('🇪🇪');
  });

  it('should convert eg to 🇪🇬', () => {
    expect(toCountryFlag('eg')).toBe('🇪🇬');
  });

  it('should convert es to 🇪🇸', () => {
    expect(toCountryFlag('es')).toBe('🇪🇸');
  });

  it('should convert fi to 🇫🇮', () => {
    expect(toCountryFlag('fi')).toBe('🇫🇮');
  });

  it('should convert gg to 🇬🇬', () => {
    expect(toCountryFlag('gg')).toBe('🇬🇬');
  });

  it('should convert gr to 🇬🇷', () => {
    expect(toCountryFlag('gr')).toBe('🇬🇷');
  });

  it('should convert gt to 🇬🇹', () => {
    expect(toCountryFlag('gt')).toBe('🇬🇹');
  });

  it('should convert gy to 🇬🇾', () => {
    expect(toCountryFlag('gy')).toBe('🇬🇾');
  });

  it('should convert hk to 🇭🇰', () => {
    expect(toCountryFlag('hk')).toBe('🇭🇰');
  });

  it('should convert hn to 🇭🇳', () => {
    expect(toCountryFlag('hn')).toBe('🇭🇳');
  });

  it('should convert hr to 🇭🇷', () => {
    expect(toCountryFlag('hr')).toBe('🇭🇷');
  });

  it('should convert hu to 🇭🇺', () => {
    expect(toCountryFlag('hu')).toBe('🇭🇺');
  });

  it('should convert id to 🇮🇩', () => {
    expect(toCountryFlag('id')).toBe('🇮🇩');
  });

  it('should convert ie to 🇮🇪', () => {
    expect(toCountryFlag('ie')).toBe('🇮🇪');
  });

  it('should convert il to 🇮🇱', () => {
    expect(toCountryFlag('il')).toBe('🇮🇱');
  });

  it('should convert in to 🇮🇳', () => {
    expect(toCountryFlag('in')).toBe('🇮🇳');
  });

  it('should convert it to 🇮🇹', () => {
    expect(toCountryFlag('it')).toBe('🇮🇹');
  });

  it('should convert jm to 🇯🇲', () => {
    expect(toCountryFlag('jm')).toBe('🇯🇲');
  });

  it('should convert lc to 🇱🇨', () => {
    expect(toCountryFlag('lc')).toBe('🇱🇨');
  });

  it('should convert lt to 🇱🇹', () => {
    expect(toCountryFlag('lt')).toBe('🇱🇹');
  });

  it('should convert lu to 🇱🇺', () => {
    expect(toCountryFlag('lu')).toBe('🇱🇺');
  });

  it('should convert lv to 🇱🇻', () => {
    expect(toCountryFlag('lv')).toBe('🇱🇻');
  });

  it('should convert md to 🇲🇩', () => {
    expect(toCountryFlag('md')).toBe('🇲🇩');
  });

  it('should convert me to 🇲🇪', () => {
    expect(toCountryFlag('me')).toBe('🇲🇪');
  });

  it('should convert mk to 🇲🇰', () => {
    expect(toCountryFlag('mk')).toBe('🇲🇰');
  });

  it('should convert mu to 🇲🇺', () => {
    expect(toCountryFlag('mu')).toBe('🇲🇺');
  });

  it('should convert mx to 🇲🇽', () => {
    expect(toCountryFlag('mx')).toBe('🇲🇽');
  });

  it('should convert my to 🇲🇾', () => {
    expect(toCountryFlag('my')).toBe('🇲🇾');
  });

  it('should convert mz to 🇲🇿', () => {
    expect(toCountryFlag('mz')).toBe('🇲🇿');
  });

  it('should convert ni to 🇳🇮', () => {
    expect(toCountryFlag('ni')).toBe('🇳🇮');
  });

  it('should convert nl to 🇳🇱', () => {
    expect(toCountryFlag('nl')).toBe('🇳🇱');
  });

  it('should convert no to 🇳🇴', () => {
    expect(toCountryFlag('no')).toBe('🇳🇴');
  });

  it('should convert nz to 🇳🇿', () => {
    expect(toCountryFlag('nz')).toBe('🇳🇿');
  });

  it('should convert pa to 🇵🇦', () => {
    expect(toCountryFlag('pa')).toBe('🇵🇦');
  });

  it('should convert pe to 🇵🇪', () => {
    expect(toCountryFlag('pe')).toBe('🇵🇪');
  });

  it('should convert ph to 🇵🇭', () => {
    expect(toCountryFlag('ph')).toBe('🇵🇭');
  });

  it('should convert pl to 🇵🇱', () => {
    expect(toCountryFlag('pl')).toBe('🇵🇱');
  });

  it('should convert pt to 🇵🇹', () => {
    expect(toCountryFlag('pt')).toBe('🇵🇹');
  });

  it('should convert py to 🇵🇾', () => {
    expect(toCountryFlag('py')).toBe('🇵🇾');
  });

  it('should convert ro to 🇷🇴', () => {
    expect(toCountryFlag('ro')).toBe('🇷🇴');
  });

  it('should convert rs to 🇷🇸', () => {
    expect(toCountryFlag('rs')).toBe('🇷🇸');
  });

  it('should convert se to 🇸🇪', () => {
    expect(toCountryFlag('se')).toBe('🇸🇪');
  });

  it('should convert sg to 🇸🇬', () => {
    expect(toCountryFlag('sg')).toBe('🇸🇬');
  });

  it('should convert si to 🇸🇮', () => {
    expect(toCountryFlag('si')).toBe('🇸🇮');
  });

  it('should convert sk to 🇸🇰', () => {
    expect(toCountryFlag('sk')).toBe('🇸🇰');
  });

  it('should convert sv to 🇸🇻', () => {
    expect(toCountryFlag('sv')).toBe('🇸🇻');
  });

  it('should convert tc to 🇹🇨', () => {
    expect(toCountryFlag('tc')).toBe('🇹🇨');
  });

  it('should convert th to 🇹🇭', () => {
    expect(toCountryFlag('th')).toBe('🇹🇭');
  });

  it('should convert tt to 🇹🇹', () => {
    expect(toCountryFlag('tt')).toBe('🇹🇹');
  });

  it('should convert tw to 🇹🇼', () => {
    expect(toCountryFlag('tw')).toBe('🇹🇼');
  });

  it('should convert ua to 🇺🇦', () => {
    expect(toCountryFlag('ua')).toBe('🇺🇦');
  });

  it('should convert uy to 🇺🇾', () => {
    expect(toCountryFlag('uy')).toBe('🇺🇾');
  });

  it('should convert ve to 🇻🇪', () => {
    expect(toCountryFlag('ve')).toBe('🇻🇪');
  });

  it('should convert za to 🇿🇦', () => {
    expect(toCountryFlag('za')).toBe('🇿🇦');
  });
});
