import { sort } from './sort';

interface DummyInterface {
  property: string;
  nested: DummyNested;
}

interface DummyNested {
  name: string;
  nestedv2?: {
    value: number;
  }
}

describe('sort', () => {
  let array: DummyInterface[];
  beforeEach(() => {
    array = [{
      property: 'D',
      nested: {
        name: 'D',
        nestedv2: {
          value: 4
        }
      },
    },
    {
      property: 'A',
      nested: {
        name: 'A',
        nestedv2: {
          value: 1
        }
      },
    },
    {
      property: 'C',
      nested: {
        name: 'C',
        nestedv2: {
          value: 3
        }
      },
    },
    {
      property: 'B',
      nested: {
        name: 'B',
        nestedv2: {
          value: 2
        }
      },
    }];
  });

  it('Sort should sort values on descending way', () => {
    array.sort((a, b) => sort(a, b, {
      fieldMap: 'nested.nestedv2.value',
      order: 'desc'
    }));
    const joined = array.map(a => a.nested.nestedv2.value).join(',');
    expect(joined).toBe('4,3,2,1');
  })

  it('Sort should sort properties on ascending way', () => {
    array.sort((a, b) => sort(a, b, {
      field: 'property',
      order: 'asc'
    }));
    const joined = array.map(a => a.property).join(',');
    expect(joined).toBe('A,B,C,D');
  })
});