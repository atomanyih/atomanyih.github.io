# Adding an Asymmetric Matcher to Jest with Typescript

In this post, we add ab asymmetric matcher to a jest+typescript codebase in order to make fluent assertions
 about imprecise numbers. (usually the result of trigonometry. eg: `0.49999999999999994`, `1.323049e-6`).
 
Jest allows "argument matchers" or "asymmetric matchers" for cases when we have objects


- Summary:
concepts: javascript, testing, Jest, custom matchers, asymmetric matchers. Typescript, declaration files

- Motivation:
Trigonemtric functions like `Math.sin`, `Math.cos`, `Math.tan` etc will return weird numbers
ex: `Math.sin(Math.PI/6)` is ostensibly `0.5`, but returns `0.49999999999999994`
`Math.sin(Math.PI)` is ostensibly `0`, but returns `1.2246467991473532e-16`

Thus `expect(Math.sin(Math.PI)).toEqual(0)` will fail, causing many to throw up their hands saying "I can't test this!" 

Luckily, 

- Background


- How to:
- Caveats

- asymmetric matchers are:
    - `jest.anything`
    - `jest.objectContaining`
- jest includes `toBeCloseTo` as a matcher, but not as an asymmetric matcher
- jest automatically turns custom matchers into asymmetric matchers


```typescript
// matchers.ts

expect.extend({
  toBeAround(actual : number, expected : number, precision = 2) {
    const pass = Math.abs(expected - actual) < Math.pow(10, -precision) / 2;
    if (pass) {
      return {
        message: () => `expected ${actual} not to be around ${expected}`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${actual} to be around ${expected}`,
        pass: false
      }
    }
  }
});
```

Add types for matcher and asymmetric matcher
```typescript
// jest.d.ts

export {};
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeAround(expected: number, precision: number): R;
    }

    interface Expect {
      toBeAround(expected: number, precision: number): any;
    }
  }
}

```

Usage

```typescript
it('sines', () => {
  expect(arc(Math.PI/2)).toEqual({
    x: 0.5,
    y: expect.toBeAround(0.707, 3)
  });
}); 
```

You might say: "that's a lot of work for a simple assertion, why not just do:"

```typescript
it('sines', () => {
  expect(arc(Math.PI/2).x).toEqual(0.5);
  expect(arc(Math.PI/2).y).toBeCloseTo(0.707, 3);
}); 
```

And you might be right for this case. It's certainly a stylistic choice, 
and I often find that assertions on the entire object give a wholistic sense of the return value
vs asserting on individual attributes.

In the context where I am using this, the object is more complicated: building the path commands for a 
path containing multiple arcs. So, something like: `M 0 1  A 1 1 0 0 0 0.5 0.7071`

This makes it a little more easier and fluent to test drawing logic, something that, in my experience,
is frequently undertested due to the frequency of imprecise or irrational numeric values