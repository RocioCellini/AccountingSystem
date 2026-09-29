import React, { Suspense, lazy } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { history } from "./history";
import { connect } from "react-redux";
import Spinner from "./components/@vuexy/spinner/Loading-spinner";
import { ContextLayout } from "./utility/context/Layout";
import LoginContainer from "./containers/Login/LoginContainer";
import Cookies from "js-cookie";


const Home = lazy(() => import("./views/pages/Home"));

const login = lazy(() => import("./containers/Login/LoginContainer"));

const user = lazy(() => import("./views/pages/users"));

const altas = lazy(() => import("./containers/Altas/AltasContainer"));

const empleados = lazy(() => import("./views/pages/empleados"));

const empleado = lazy(() => import("./views/pages/empleado"));

const cuotapartistas = lazy(() => import("./views/pages/cuotapartistas"));

const cuotapartista = lazy(() => import("./views/pages/cuotapartista"));

const llaves = lazy(() => import("./views/pages/llaves"));

const cuentas_contables = lazy(() => import("./views/pages/cuentas_contables"));

const novedades = lazy(() => import("./views/pages/novedades"));

const configuraciones = lazy(() => import("./views/pages/configuraciones"));

const revision = lazy(() => import("./views/pages/revision"));

const incrementosMasivos = lazy(() =>
  import("./views/pages/incrementos_masivos")
);

const comisiones = lazy(() => import("./views/pages/comisiones"));

const bono_semestral = lazy(() => import("./views/pages/bono_semestral"));

const bono_trimestral = lazy(() => import("./views/pages/bono_trimestral"));

const bono_trimestral_rrhh = lazy(() =>
  import("./views/pages/bono_trimestral_rrhh")
);

const gratificacion_especial = lazy(() =>
  import("./views/pages/gratificacion_especial")
);

const comparaciones = lazy(() => import("./views/pages/comparaciones"));

const oficial = lazy(() => import("./views/pages/oficial"));

const ayuda = lazy(() => import("./views/pages/ayuda"));

const centroCostos= lazy(() => import("./containers/CostCenter/CostContainer"));


const RouteConfig = ({
  component: Component,
  fullLayout,
  permission,
  user,
  token,
  ...rest
}) => {
  const isAuthenticated = Boolean(token);

  return (
    <Route
      {...rest}
      render={props => (
        <ContextLayout.Consumer>
          {context => {
            const LayoutTag =
              fullLayout === true
                ? context.fullLayout
                : context.state.activeLayout === "horizontal"
                ? context.horizontalLayout
                : context.VerticalLayout;

            return (
              <LayoutTag {...props} permission={user}>
                <Suspense fallback={<Spinner />}>
                  {!isAuthenticated ? (
                    rest.path === "/" ? (
                      <LoginContainer {...props} />
                    ) : (
                      <Redirect to="/" />
                    )
                  ) : (
                    <Component {...props} />
                  )}
                </Suspense>
              </LayoutTag>
            );
          }}
        </ContextLayout.Consumer>
      )}
    />
  );
};
const mapStateToProps = state => {
  return {
    user: state.user.role || Cookies.get("user"),
    token: state.user.info.token || Cookies.get("api_token"),
  };
};

const AppRoute = connect(mapStateToProps)(RouteConfig);

class AppRouter extends React.Component {
  render() {
    return (

      <Router history={history}>
        <Switch>
          <AppRoute exact path="/home" component={Home} />

          <AppRoute exact path="/usuarios" component={user} />

          <AppRoute exact path="/altas" component={altas} />

          <AppRoute exact path="/empleados" component={empleados} />

          <AppRoute
            exact
            path="/configuracion-comisiones/cuotapartistas"
            component={cuotapartistas}
          />

          <AppRoute
            exact
            path="/configuracion-comisiones/cuotapartistas/getone/:id"
            component={cuotapartista}
          />

          <AppRoute exact path="/llaves" component={llaves} />

          <AppRoute
            exact
            path="/cuentas-contables"
            component={cuentas_contables}
          />

          <AppRoute
            exact
            path="/empleados/oficiales/getone/:id"
            component={oficial}
          />

          <AppRoute
            exact
            path="/incrementos-masivos"
            component={incrementosMasivos}
          />

          <AppRoute exact path="/novedades" component={novedades} />

          <AppRoute exact path="/comisiones" component={comisiones} />

          <AppRoute exact path="/configuraciones" component={configuraciones} />

          <AppRoute exact path="/revision" component={revision} />

          <AppRoute
            exact
            path="/gratificacion_especial"
            component={gratificacion_especial}
          />

          <AppRoute exact path="/bono_semestral" component={bono_semestral} />

          <AppRoute exact path="/bono_trimestral" component={bono_trimestral} />

          <AppRoute
            exact
            path="/bono_trimestral_rrhh"
            component={bono_trimestral_rrhh}
          />

          <AppRoute exact path="/comparaciones" component={comparaciones} />

          <AppRoute path="/empleados/getone/:id" component={empleado} />

          <AppRoute path="/ayuda" component={ayuda} />

          <AppRoute path="/centro-costos" component={centroCostos} />

          <AppRoute path="/" component={login} fullLayout />
        </Switch>
      </Router>
    );
  }
}

const conetAppRouter = connect(mapStateToProps)(AppRouter);

export default conetAppRouter;
