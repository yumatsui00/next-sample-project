export type ProblemErrorItem = {
    field?: string
    code: string
    message: string
}

export type ProblemExtension = {
    code: string
    retryable: boolean
    traceId?: string
    errors?: ProblemErrorItem[]
    retryAfter?: number
}

export type ProblemDetail = {
    type: string
    title: string
    status: number
    detail: string
    instance: string
} & ProblemExtension