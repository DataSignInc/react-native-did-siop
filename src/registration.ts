export class ProtocolNegotiation {
  private registration: Registration;
  constructor(registration: Registration) {
    this.registration = registration;
  }

  validate(registration: Registration) {
    const r = registration;
  }

  isValidDID(did: string) {
    return !this.registration.did || did == this.registration.did;
  }

  negotiateSubjectIDType(r: Registration) {
    //
    r.subject_identifier_types_supported;
  }
}
