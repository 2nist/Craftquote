# CraftQuote - Hybrid Component Assembler System

A powerful Google Apps Script-based component assembler for automated quote generation with real-time Master Catalog integration.

## 🚀 Features

### Database-Driven Architecture
- **Product Templates**: Maintainable templates stored in spreadsheet database
- **Smart Suggestions**: Intelligent component recommendations
- **Assembly Editor**: Professional interface for creating new component assemblies
- **Real-time Integration**: Live data from Master Catalog with actual pricing

### Key Components
- **HybridAssemblerBackend.gs**: Core backend logic with database-driven template system
- **HybridComponentAssembler.html**: Professional UI with template launcher and component library
- **AssemblyEditor.html**: Dedicated interface for creating new assemblies
- **MenuFunctions.gs**: Google Sheets menu integration

### Advanced Capabilities
- Multi-source component lookup (Master Catalog, Options, external sources)
- Automatic placeholder generation for missing components
- BOM generation with pricing calculations
- Quote validation and professional output
- Template management system

## 📋 Setup Instructions

See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for detailed deployment steps.

## 🏗️ Architecture

The system has been transformed from static hardcoded templates to a fully database-driven architecture:

1. **Templates** → Product_Templates sheet (user-maintainable)
2. **Assemblies** → Options and Option_BOM_Mapping sheets
3. **Components** → Master Catalog integration
4. **Smart Logic** → Dynamic suggestions and validation

## 📊 Database Structure

- **Product_Templates**: Template definitions with component lists and configurations
- **Options**: Assembly definitions and metadata
- **Option_BOM_Mapping**: Component relationships and pricing
- **Master Catalog**: Live component database with real pricing

## 🔧 Development

The system is built for Google Apps Script environment and integrates seamlessly with Google Sheets for real-time data access and quote generation.

---

*Developed for craft automation industry with focus on brewery, distillery, and industrial automation systems.*
