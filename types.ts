
export enum Status {
    IDLE = 'idle',
    PROCESSING = 'processing',
    SUCCESS = 'success',
    ERROR = 'error',
}

export enum PipelineStage {
    VALIDATING = 'Validating Data',
    PLANNING = 'Planning Analysis',
    GENERATING = 'Generating Code',
    EXECUTING = 'Executing',
    VISUALIZING = 'Visualizing',
    COMPLETE = 'Complete',
}

export interface ValidationIssue {
    severity: 'critical' | 'warning' | 'info';
    message: string;
}

export interface ValidationReport {
    totalRows: number;
    totalColumns: number;
    missingValues: number;
    missingValuePercent: number;
    duplicateRows: number;
    duplicateRowsPercent: number;
    dataTypes: Record<string, string>;
    issues: ValidationIssue[];
}

export interface ResultMetadata {
    executionTime: number;
    timestamp: string;
    outputFile: string;
}

export interface AppState {
    status: Status;
    currentStage: PipelineStage | null;
    query: string;
    file: File | null;
    validationReport: ValidationReport | null;
    analysisPlan: string | null;
    generatedCode: string | null;
    resultData: Record<string, any>[] | null;
    chartConfig: any | null;
    summary: string | null;
    error: string | null;
    metadata: ResultMetadata | null;
}
