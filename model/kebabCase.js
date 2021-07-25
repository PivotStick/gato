exports.kebabCase = (string = "") => {
    let [first, ...rest] = string

    first = first
    rest = rest.join("").replace(/[A-Z]/g, "-$&")

    rest = rest.endsWith("y") ? rest.replace(/y$/, "ies") : rest + "s"

    return (first + rest).toLowerCase()
}
