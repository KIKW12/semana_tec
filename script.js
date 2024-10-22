// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Inicialización de la aplicación
function initializeApp() {
    const semesterSelect = document.getElementById('semesterSelect');
    if (semesterSelect) {
        semesterSelect.addEventListener('change', changeSemester);
        // Mostrar el primer semestre por defecto
        const firstSemester = document.querySelector('.semester');
        if (firstSemester) {
            firstSemester.style.display = 'block';
        }
    }
    updatePeriodBars();
    setupRequirementsTooltip();
}

// Cambio de semestre
function changeSemester(event) {
    const semesters = document.getElementsByClassName('semester');
    Array.from(semesters).forEach(semester => {
        semester.style.display = 'none';
        semester.style.opacity = '0';
    });

    const selectedSemester = document.getElementById(event.target.value);
    if (selectedSemester) {
        selectedSemester.style.display = 'block';
        requestAnimationFrame(() => {
            selectedSemester.style.opacity = '1';
            selectedSemester.style.transition = 'opacity 0.3s ease';
        });
    }
}

// Actualización de las barras de período
function updatePeriodBars() {
    const periodBars = document.querySelectorAll('.duration-bar');
    periodBars.forEach(bar => {
        const periods = bar.getAttribute('data-periods')?.split(',') || [];
        updateSinglePeriodBar(bar, periods);
    });
}

// Actualiza una sola barra de período
function updateSinglePeriodBar(bar, periods) {
    const segments = bar.querySelectorAll('.duration-segment');
    segments.forEach((segment, index) => {
        const fill = segment.querySelector('.duration-fill');
        if (fill) {
            const isPeriodActive = periods.includes((index + 1).toString());
            fill.style.width = isPeriodActive ? '100%' : '0';
            fill.style.backgroundColor = getPeriodColor(index + 1);
        }
    });

    // Actualizar tooltip con información de períodos
    const periodsText = getPeriodText(periods);
    bar.title = periodsText;
}

// Obtener color según el período
function getPeriodColor(period) {
    switch(period) {
        case 1: return '#4CAF50'; // Verde para semanas 1-6
        case 2: return '#FFA726'; // Naranja para semanas 7-12
        case 3: return '#F44336'; // Rojo para semanas 13-18
        default: return '#CCCCCC';
    }
}

// Obtener texto descriptivo de los períodos
function getPeriodText(periods) {
    if (!periods.length) return 'Sin período asignado';

    const periodTexts = periods.map(period => {
        switch(period) {
            case '1': return 'Semana 1-6';
            case '2': return 'Semana 7-12';
            case '3': return 'Semana 13-18';
            default: return '';
        }
    }).filter(text => text !== '');

    return periodTexts.join(', ');
}

// Configuración del tooltip de requisitos
function setupRequirementsTooltip() {
    const courseNames = document.querySelectorAll('.course-name');
    const tooltip = document.getElementById('requirements-tooltip');
    const requirementsList = document.getElementById('requirements-list');

    if (!tooltip || !requirementsList) return;

    courseNames.forEach(courseName => {
        courseName.addEventListener('mouseenter', event => showTooltip(event, courseName, tooltip, requirementsList));
        courseName.addEventListener('mouseleave', () => hideTooltip(tooltip));
    });

    // Evitar que el tooltip desaparezca cuando el mouse está sobre él
    tooltip.addEventListener('mouseenter', () => {
        tooltip.style.display = 'block';
    });

    tooltip.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
}

// Mostrar tooltip
function showTooltip(event, courseName, tooltip, requirementsList) {
    // Obtener requisitos y períodos
    const requirements = courseName.getAttribute('data-requirements')?.split(',') || [];
    const periods = courseName.closest('tr').querySelector('.duration-bar').getAttribute('data-periods')?.split(',') || [];

    updateRequirementsAndPeriods(requirementsList, requirements, periods);
    positionTooltip(event, tooltip);
}

// Actualizar lista de requisitos y períodos
function updateRequirementsAndPeriods(requirementsList, requirements, periods) {
    requirementsList.innerHTML = '';
    
    // Agregar períodos
    const periodLi = document.createElement('li');
    periodLi.style.marginBottom = '10px';
    periodLi.innerHTML = `<strong>Período:</strong> ${getPeriodText(periods)}`;
    requirementsList.appendChild(periodLi);

    // Agregar requisitos
    const reqTitle = document.createElement('li');
    reqTitle.style.marginBottom = '5px';
    reqTitle.innerHTML = '<strong>Requisitos:</strong>';
    requirementsList.appendChild(reqTitle);

    if (requirements.length === 0 || (requirements.length === 1 && requirements[0] === "Ninguno")) {
        const li = document.createElement('li');
        li.textContent = "No hay requisitos previos";
        li.style.paddingLeft = '20px';
        requirementsList.appendChild(li);
    } else {
        requirements.forEach(req => {
            const li = document.createElement('li');
            li.textContent = req.trim();
            li.style.paddingLeft = '20px';
            requirementsList.appendChild(li);
        });
    }
}

// Posicionar tooltip
function positionTooltip(event, tooltip) {
    const padding = 10;
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let left = event.pageX + padding;
    let top = event.pageY + padding;

    if (left + tooltipWidth > windowWidth) {
        left = event.pageX - tooltipWidth - padding;
    }

    if (top + tooltipHeight > windowHeight) {
        top = event.pageY - tooltipHeight - padding;
    }

    left = Math.max(padding, left);
    top = Math.max(padding, top);

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.display = 'block';
}

// Ocultar tooltip
function hideTooltip(tooltip) {
    tooltip.style.display = 'none';
}

// Manejo de errores global
window.addEventListener('error', function(event) {
    console.error('Error en la aplicación:', event.error);
});