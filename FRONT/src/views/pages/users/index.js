import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { COLORS } from "../../../utility/utils";
import API from './../../../api';
import {
    Button,
    Input,
    Card,
    CardBody,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    Label,
    ModalFooter,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEdit,
    faFileExcel,
    faPlusCircle,
    faTimesCircle,
    faTrashRestore,
} from "@fortawesome/free-solid-svg-icons";

import Select from "react-select";
import { downloadUsers } from "../../../services/user.services";


const Index = (props) => {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState([]);
    const [data, setData] = useState([]);
    const [roles, setRoles] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [columns, setColumns] = useState([]);
    const [buscador, setBuscador] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [empleadoTouched, setEmpleadoTouched] = useState(false);

    useEffect(() => {
        setColumns([
            { name: "Id", width: '10%', cell: (row) => (<span style={{ color: (row.deleted_at) ? COLORS.ERROR : COLORS.BLACK }}>{row.id}</span>) },
            { name: "Descripcion", width: '20%', cell: (row) => (<span style={{ color: (row.deleted_at) ? COLORS.ERROR : COLORS.BLACK }}>{row.email}</span>) },
            { name: "Categoria", width: '20%', cell: (row) => (<span style={{ color: (row.deleted_at) ? COLORS.ERROR : COLORS.BLACK }}>{row.rol.descripcion}</span>) },
            { name: "Ult. Modif", selector: "updated_at_formatted", width: '30%', cell: (row) => (<span style={{ color: (row.deleted_at) ? COLORS.ERROR : COLORS.BLACK }}>{row.updated_at_formatted}</span>) },
            {
                name: "Accion", width: '20%', cell: (row) => (
                    <div>
                        {!row.deleted_at &&
                            <div>
                                <Button.Ripple size='sm' style={{ marginLeft: 10, marginRight: 10 }} onClick={() => { setUser(row); setShowModal(true); }} color="primary">
                                    <FontAwesomeIcon style={{ color: COLORS.WHITE }} icon={faEdit} />
                                </Button.Ripple>
                                <Button.Ripple size='sm' style={{ marginLeft: 10, marginRight: 10 }}
                                    onClick={() => {
                                        API.deleteUser(row.id).then((response) => {
                                            setUsers(response.data.users);
                                            setData(response.data.users.map((e) => ({
                                                ...e,
                                                obj: JSON.stringify(e),
                                            })));
                                        });
                                    }} color="danger">
                                    <FontAwesomeIcon style={{ color: COLORS.WHITE }} icon={faTimesCircle} />
                                </Button.Ripple>
                            </div>
                        }
                        {row.deleted_at &&
                            <Button.Ripple size='sm' style={{ marginLeft: 10, marginRight: 10 }}
                                onClick={() => {
                                    API.restoreUser(row.id).then((response) => {
                                        setUsers(response.data.users);
                                        setData(response.data.users.map((e) => ({
                                            ...e,
                                            obj: JSON.stringify(e),
                                        })));
                                    });
                                }} color="warning">
                                <FontAwesomeIcon style={{ color: COLORS.WHITE }} icon={faTrashRestore} />
                            </Button.Ripple>
                        }
                    </div>)
            },
        ]);

        API.getUsers().then((response) => {
            setRoles(response.data.roles.map((e) => ({ label: e.descripcion, value: e.id, obj: e })));
            setEmpleados(response.data.empleados.map((e) => ({ label: e.nombre_apellido, value: e.id, obj: e })));
            setUsers(response.data.users);
            setData(response.data.users.map((e) => ({
                ...e,
                obj: JSON.stringify(e),
            })));
        });
    }, []);

    useEffect(() => {
        if (buscador === '') {
            setData(users.map((e) => ({
                ...e,
                obj: JSON.stringify(e),
            })));
        } else {
            let response = [];
            users.forEach((e) => {
                if (e.email.toUpperCase().includes(buscador.toUpperCase()) ||
                    e.rol.descripcion.toUpperCase().includes(buscador.toUpperCase())) {
                    response.push(e);
                }
            });
            setData(response.map((e) => ({
                ...e,
                obj: JSON.stringify(e),
            })));
        }
    }, [buscador, users]);

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: COLORS.SECONDARY,
                color: COLORS.WHITE,
                textAlign: 'center'
            },
        },
    };

    return (
        <div>
            <Row style={{ marginTop: 30 }}>
                <Col md={12} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <span style={{ fontSize: 30, color: COLORS.SECONDARY, fontWeight: 'bold' }}>Usuarios</span>

                    <Input
                        type="text"
                        placeholder="Buscador"
                        style={{ width: 300, borderRadius: 10, marginLeft: 30, marginRight: 30 }}
                        value={buscador}
                        onChange={e => setBuscador(e.target.value)} />

                    <Button.Ripple size="md" outline={false} color="primary" onClick={() => {
                        setShowModal(true);
                        setUser([]);
                        setEmpleadoTouched(false);
                    }}>
                        <FontAwesomeIcon style={{ marginLeft: 4, marginRight: 4 }} color={COLORS.WHITE} icon={faPlusCircle} />
                        Nuevo Usuario
                    </Button.Ripple>

                    {/* Actualiza el ícono de descarga a uno de Excel */}
                    <Button.Ripple size="md" color="success" style={{ marginLeft: 10 }} onClick={downloadUsers}>
                        <FontAwesomeIcon icon={faFileExcel} style={{ marginRight: 5 }} />
                        Exportar
                    </Button.Ripple>
                </Col>
            </Row>

            <Card style={{ marginTop: 30 }}>
                <CardBody>
                    <Row>
                        <Col md={12}>
                            <Modal
                                isOpen={showModal}
                                toggle={() => setShowModal(!showModal)}
                                className="modal-dialog-centered">
                                <ModalHeader toggle={() => setShowModal(!showModal)} className="bg-primary">
                                    {user.id ? 'Modificar Usuario' : 'Nuevo Usuario'}
                                </ModalHeader>
                                <ModalBody>
                                    <FormGroup>
                                        <Label style={{ fontWeight: 'bold' }}>Nombre:</Label>
                                        <Input
                                            type="text"
                                            placeholder="Nombre"
                                            style={{ width: 300, marginTop: 5 }}
                                            value={user.name}
                                            onChange={e => setUser({ ...user, name: e.target.value })} />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label style={{ fontWeight: 'bold' }}>Email:</Label>
                                        <Input
                                            type="text"
                                            placeholder="Email"
                                            style={{ width: 300, marginTop: 5 }}
                                            value={user.email}
                                            onChange={e => setUser({ ...user, email: e.target.value })} />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label style={{ fontWeight: 'bold' }}>Password:</Label>
                                        <Input
                                            type="text"
                                            placeholder="Password"
                                            style={{ width: 300, marginTop: 5 }}
                                            value={user.password}
                                            onChange={e => setUser({ ...user, password: e.target.value })} />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label style={{ fontWeight: 'bold' }}>Rol:</Label>
                                        <Select
                                            className="React"
                                            classNamePrefix="select"
                                            isSearchable={true}
                                            isClearable={true}
                                            options={roles}
                                            style={{ width: 300, marginTop: 5 }}
                                            value={{ label: user?.rol?.descripcion, value: user?.rol?.id, obj: {} }}
                                            onChange={(e) => {
                                                setUser({ ...user, rol_id: e?.value, rol: (e?.obj ?? []) })
                                            }}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label style={{ fontWeight: 'bold' }}>
                                            Empleado: <span style={{ color: 'red' }}>*</span>
                                        </Label>
                                        <Select
                                            className="React"
                                            classNamePrefix="select"
                                            isSearchable={true}
                                            isClearable={false}
                                            options={empleados}
                                            style={{ width: 300, marginTop: 5 }}
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    borderColor: (!user.empleado_id && empleadoTouched) ? 'red' : base.borderColor,
                                                })
                                            }}
                                            value={{ label: user?.empleado?.nombre_apellido, value: user?.empleado?.id, obj: {} }}
                                            onChange={(e) => {
                                                setUser({ ...user, empleado_id: e?.value, empleado: (e?.obj ?? []) })
                                            }}
                                            onBlur={() => setEmpleadoTouched(true)}
                                        />
                                        {!user.empleado_id && empleadoTouched && (
                                            <span style={{ color: 'red', fontSize: 12 }}>Este campo es obligatorio</span>
                                        )}
                                    </FormGroup>
                                </ModalBody>

                                <ModalFooter>
                                    <Button
                                        color="primary"
                                        disabled={!user.empleado_id}
                                        onClick={() => {
                                            if (!user.empleado_id) {
                                                return;
                                            }
                                            API.saveUser(user).then((response) => {
                                                setUsers(response.data.users);
                                                setData(response.data.users.map((e) => ({
                                                    ...e,
                                                    obj: JSON.stringify(e),
                                                })));
                                                setShowModal(!showModal);
                                            });
                                        }}>
                                        Guardar
                                    </Button>
                                </ModalFooter>
                            </Modal>

                            <DataTable
                                data={data}
                                columns={columns}
                                pagination
                                striped
                                noDataComponent={'No hay datos'}
                                customStyles={customStyles}
                            />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </div>
    );
};

export default Index;
