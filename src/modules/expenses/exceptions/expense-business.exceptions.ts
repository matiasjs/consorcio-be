import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

export class ExpenseBusinessException extends BadRequestException {
  constructor(message: string, code: string) {
    super({
      message,
      error: 'Expense Business Rule Violation',
      code,
    });
  }
}

export class ExpenseAlreadyExistsException extends ConflictException {
  constructor(period: string, buildingName?: string) {
    super({
      message: `Ya existe una expensa para el período ${period}${buildingName ? ` en el edificio ${buildingName}` : ''}. Solo se permite una expensa por edificio por mes.`,
      error: 'Expense Already Exists',
      code: 'EXPENSE_ALREADY_EXISTS',
      period,
      buildingName,
    });
  }
}

export class BuildingNotFoundOrUnauthorizedException extends NotFoundException {
  constructor(buildingId: string) {
    super({
      message: `El edificio especificado no existe o no tienes permisos para acceder a él.`,
      error: 'Building Not Found or Unauthorized',
      code: 'BUILDING_NOT_FOUND_OR_UNAUTHORIZED',
      buildingId,
    });
  }
}

export class NoActiveUnitsException extends ExpenseBusinessException {
  constructor(buildingName?: string) {
    super(
      `No se encontraron unidades activas${buildingName ? ` en el edificio ${buildingName}` : ''}. Debe haber al menos una unidad activa para generar expensas.`,
      'NO_ACTIVE_UNITS'
    );
  }
}

export class InvalidPeriodFormatException extends ExpenseBusinessException {
  constructor(period: string) {
    super(
      `El formato del período "${period}" es inválido. Debe ser YYYY-MM (ej: 2025-10).`,
      'INVALID_PERIOD_FORMAT'
    );
  }
}

export class FuturePeriodException extends ExpenseBusinessException {
  constructor(period: string) {
    super(
      `No se pueden crear expensas para períodos futuros. El período "${period}" es posterior al mes actual.`,
      'FUTURE_PERIOD_NOT_ALLOWED'
    );
  }
}

export class InvalidDueDateException extends ExpenseBusinessException {
  constructor(dueDate: string, period: string) {
    super(
      `La fecha de vencimiento "${dueDate}" debe ser posterior al período de la expensa "${period}".`,
      'INVALID_DUE_DATE'
    );
  }
}

export class EmptyExpenseItemsException extends ExpenseBusinessException {
  constructor() {
    super(
      'Una expensa debe tener al menos un gasto asociado.',
      'EMPTY_EXPENSE_ITEMS'
    );
  }
}

export class InvalidExpenseAmountException extends ExpenseBusinessException {
  constructor(amount: number) {
    super(
      `El monto del gasto (${amount}) debe ser mayor a cero.`,
      'INVALID_EXPENSE_AMOUNT'
    );
  }
}

export class ExpenseItemDescriptionRequiredException extends ExpenseBusinessException {
  constructor() {
    super(
      'Todos los gastos deben tener una descripción.',
      'EXPENSE_ITEM_DESCRIPTION_REQUIRED'
    );
  }
}

export class InvalidDistributionMethodException extends ExpenseBusinessException {
  constructor(method: string, reason: string) {
    super(
      `El método de distribución "${method}" no se puede aplicar: ${reason}`,
      'INVALID_DISTRIBUTION_METHOD'
    );
  }
}

export class ExpenseAlreadyGeneratedException extends ConflictException {
  constructor(period: string, status: string) {
    super({
      message: `La expensa del período ${period} ya fue generada y tiene estado "${status}". No se puede modificar.`,
      error: 'Expense Already Generated',
      code: 'EXPENSE_ALREADY_GENERATED',
      period,
      status,
    });
  }
}

export class InsufficientOwnershipDataException extends ExpenseBusinessException {
  constructor(buildingName?: string) {
    super(
      `No se puede usar distribución por porcentaje de propiedad${buildingName ? ` en ${buildingName}` : ''} porque algunas unidades no tienen definido el porcentaje de propiedad.`,
      'INSUFFICIENT_OWNERSHIP_DATA'
    );
  }
}

export class InsufficientM2DataException extends ExpenseBusinessException {
  constructor(buildingName?: string) {
    super(
      `No se puede usar distribución por metros cuadrados${buildingName ? ` en ${buildingName}` : ''} porque algunas unidades no tienen definidos los metros cuadrados.`,
      'INSUFFICIENT_M2_DATA'
    );
  }
}
