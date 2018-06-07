

const TypeToGenerator: {matcher: RegExp, converter: (body: any) => Buffer}[] = []

const defaultConverter = (body:any) => Buffer.from('Unknown content-type')

export default function ConvertBody(contentType: string, body: any): Buffer {
    let converters = TypeToGenerator.filter((g) => g.matcher.exec(contentType)).map((g) => g.converter)
    if (converters.length == 0) {
        converters.push(defaultConverter)
    }

    return converters[0](body)
}

TypeToGenerator.push(
    {
        matcher: /^text\//,
        converter: (body) => Buffer.from(body.toString())
    },
    {
        matcher: /^application\/json/,
        converter: (body) => Buffer.from(JSON.stringify(body, null, "    "))
    }
)