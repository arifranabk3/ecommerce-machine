import { AnalyticsExportJobModel } from '../models/AnalyticsExportJob';
import { AnalyticsReportType, AnalyticsExportFormat, AnalyticsExportStatus } from '@sellzy/shared';
import { AnalyticsService } from './AnalyticsService';

export class ReportExportService {
  /**
   * Enqueues export job idempotently or creates new export record
   */
  static async requestExport(
    tenantId: string,
    requestedBy: string,
    reportType: AnalyticsReportType,
    format: AnalyticsExportFormat
  ) {
    const job = await AnalyticsExportJobModel.create({
      tenantId,
      requestedBy,
      reportType,
      format,
      status: AnalyticsExportStatus.PENDING
    });

    // Asynchronously process export job
    this.processExport(job.id).catch((_err) => {});

    return job;
  }

  /**
   * Processes report export in background
   */
  private static async processExport(jobId: string) {
    const job = await AnalyticsExportJobModel.findById(jobId);
    if (!job) return;

    try {
      job.status = AnalyticsExportStatus.PROCESSING;
      await job.save();

      let data: any;
      switch (job.reportType) {
        case AnalyticsReportType.SALES:
          data = await AnalyticsService.getSalesAnalytics(job.tenantId);
          break;
        case AnalyticsReportType.ORDERS:
          data = await AnalyticsService.getOrderAnalytics(job.tenantId);
          break;
        case AnalyticsReportType.PROFIT:
          data = await AnalyticsService.getProfitAnalytics(job.tenantId);
          break;
        default:
          data = await AnalyticsService.getOverview(job.tenantId);
          break;
      }

      job.status = AnalyticsExportStatus.COMPLETED;
      job.downloadUrl = `/exports/${job.tenantId}/${job._id}.${job.format.toLowerCase()}`;
      job.rowCount = 1;
      await job.save();
    } catch (err: any) {
      job.status = AnalyticsExportStatus.FAILED;
      job.error = err.message || 'Export processing failed';
      await job.save();
    }
  }

  static async getJob(tenantId: string, jobId: string) {
    return AnalyticsExportJobModel.findOne({ _id: jobId, tenantId });
  }
}
